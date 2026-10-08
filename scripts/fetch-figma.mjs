// Chỉ đọc: tải thông số node và ảnh layer từ Figma REST API.
// Token lấy từ biến môi trường FIGMA_TOKEN, không in ra và không ghi vào file.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const FILE_KEY = '93v05w3au1CsDYzL4cAPWX';
const API = 'https://api.figma.com/v1';

const ROOMS = {
  sports: {
    frames: ['1:7', '1:20', '1:35', '1:61', '1:74', '1:92', '1:111'],
    // Lấy layer ở trạng thái gốc (không có effect) để ảnh không dính bóng.
    assets: [
      { id: '1:3', file: 'bg', scale: 1 },
      { id: '1:5', file: 'racket', scale: 2 },
      { id: '1:4', file: 'ball', scale: 2 },
      { id: '1:2', file: 'goggles', scale: 2 },
      { id: '6:10', file: 'badminton-1', scale: 2 },
      { id: '6:12', file: 'badminton-2', scale: 2 },
      { id: '6:9', file: 'soccer-1', scale: 2 },
      { id: '6:6', file: 'soccer-2', scale: 2 },
      { id: '42:346', file: 'swimming-1', scale: 2 },
      { id: '42:347', file: 'swimming-2', scale: 2 },
    ],
  },
};

const room = process.argv[2];
const cfg = ROOMS[room];
if (!cfg) {
  console.error(`Phòng không hợp lệ: ${room}. Có: ${Object.keys(ROOMS).join(', ')}`);
  process.exit(1);
}
const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error('Thiếu biến môi trường FIGMA_TOKEN.');
  process.exit(1);
}

async function api(p) {
  const res = await fetch(API + p, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) {
    const body = await res.text();
    const h = ['retry-after', 'x-figma-plan-tier', 'x-figma-rate-limit-type', 'x-figma-upgrade-link']
      .map((k) => res.headers.get(k) && `${k}=${res.headers.get(k)}`).filter(Boolean).join(' ');
    throw new Error(`Figma API ${res.status} cho ${p.split('?')[0]}: ${body.slice(0, 300)} ${h}`);
  }
  return res.json();
}

// Rút gọn node để đọc dễ: vị trí tương đối frame, effect, fill, chữ.
function summarize(frame) {
  const ox = frame.absoluteBoundingBox.x;
  const oy = frame.absoluteBoundingBox.y;
  const walk = (n) => {
    const b = n.absoluteBoundingBox;
    const o = {
      id: n.id, name: n.name, type: n.type,
      box: b && { x: b.x - ox, y: b.y - oy, w: b.width, h: b.height },
    };
    if (n.visible === false) o.visible = false;
    if (n.opacity != null && n.opacity !== 1) o.opacity = n.opacity;
    if (n.rotation) o.rotation = n.rotation;
    if (n.blendMode && n.blendMode !== 'PASS_THROUGH' && n.blendMode !== 'NORMAL') o.blendMode = n.blendMode;
    if (n.effects?.length) o.effects = n.effects;
    if (n.fills?.length) o.fills = n.fills;
    if (n.strokes?.length) Object.assign(o, { strokes: n.strokes, strokeWeight: n.strokeWeight, strokeAlign: n.strokeAlign });
    if (n.cornerRadius) o.cornerRadius = n.cornerRadius;
    if (n.rectangleCornerRadii) o.rectangleCornerRadii = n.rectangleCornerRadii;
    if (n.type === 'TEXT') {
      o.characters = n.characters;
      o.style = n.style;
      if (n.styleOverrideTable && Object.keys(n.styleOverrideTable).length) {
        o.styleOverrideTable = n.styleOverrideTable;
        o.characterStyleOverrides = n.characterStyleOverrides;
      }
    }
    if (n.children) o.children = n.children.map(walk);
    return o;
  };
  return { id: frame.id, name: frame.name, fills: frame.fills, children: frame.children.map(walk) };
}

const dataDir = path.join('scripts', 'figma-data');
const outDir = path.join('src', 'assets', room);
await mkdir(dataDir, { recursive: true });
await mkdir(outDir, { recursive: true });

// 1) Thông số node
const nodes = await api(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(cfg.frames.join(','))}`);
const summary = {};
for (const id of cfg.frames) {
  const doc = nodes.nodes[id]?.document;
  if (!doc) throw new Error(`Không thấy frame ${id}`);
  summary[id] = summarize(doc);
}
await writeFile(path.join(dataDir, `${room}-nodes.json`), JSON.stringify(summary, null, 1));
console.log(`Đã lưu thông số ${cfg.frames.length} frame -> ${dataDir}/${room}-nodes.json`);

// Báo thông số effect của các thẻ kính để so với CSS đang đoán (.glass trong Room.css).
for (const [fid, f] of Object.entries(summary)) {
  for (const c of f.children) {
    if (c.effects?.some((e) => !['DROP_SHADOW', 'INNER_SHADOW', 'LAYER_BLUR', 'BACKGROUND_BLUR'].includes(e.type))
      || c.name.startsWith('Rectangle')) {
      console.log(`[glass] ${fid} ${c.id} ${c.name}:`, JSON.stringify({ effects: c.effects, fills: c.fills, strokes: c.strokes, strokeWeight: c.strokeWeight, cornerRadius: c.cornerRadius }));
    }
  }
}

// 2) Ảnh layer, xuất đúng khung node rồi đổi sang WebP q80
const byScale = Map.groupBy(cfg.assets, (a) => a.scale);
for (const [scale, list] of byScale) {
  const ids = list.map((a) => a.id).join(',');
  const res = await api(`/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=${scale}&use_absolute_bounds=true`);
  if (res.err) throw new Error(`Figma export lỗi: ${res.err}`);
  for (const a of list) {
    const url = res.images[a.id];
    if (!url) throw new Error(`Figma không trả ảnh cho ${a.id}`);
    const png = Buffer.from(await (await fetch(url)).arrayBuffer());
    const out = path.join(outDir, `${a.file}.webp`);
    const info = await sharp(png).webp({ quality: 80 }).toFile(out);
    console.log(`${a.id} -> ${out} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
  }
}
