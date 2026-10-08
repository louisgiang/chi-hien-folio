// Chuyển ảnh xuất tay từ Figma (figma-export/<room>/*.png) sang WebP trong src/assets/<room>/.
// - Ảnh full-frame: bản 1920 và bản -sm 960 cho điện thoại.
// - Ảnh trong pop-up: giữ độ phân giải 2x.
// - Layer đè lên thẻ kính: dò vị trí bằng cách khớp với ảnh hover tương ứng,
//   ghi ra src/assets/<room>/overlays.json (tọa độ theo khung 1920×1080).
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOMS = {
  sports: {
    frames: ['sports-base', 'sports-hover-racket', 'sports-hover-ball', 'sports-hover-goggles'],
    photos: ['badminton-1', 'badminton-2', 'soccer-1', 'soccer-2', 'swimming-1', 'swimming-2'],
    // sprite: file layer; frame: ảnh hover chứa cùng đồ vật đó; guess: vị trí layer trong Figma (1x).
    overlays: [
      { sprite: 'badminton-above-racket', frame: 'sports-hover-racket', guess: { x: -15, y: 278, w: 457, h: 802 } },
      { sprite: 'soccer-above-ball', frame: 'sports-hover-ball', guess: { x: 429, y: 334, w: 433, h: 528 } },
    ],
    // Khung hover của từng đồ vật (1x), để kiểm tra ảnh hover chỉ khác ảnh gốc ở đúng chỗ đó.
    intro: { x: 865, y: 236, w: 1019, h: 188 },
    hoverBoxes: {
      'sports-hover-racket': { x: -15, y: 278, w: 457, h: 802, glow: 80 },
      'sports-hover-ball': { x: 429, y: 334, w: 433, h: 528, glow: 60 },
      'sports-hover-goggles': { x: 1314, y: 711, w: 151, h: 131, glow: 50 },
    },
  },
  robotics: {
    frames: ['robotics-base', 'robotics-hover-gart', 'robotics-hover-events', 'robotics-hover-competitions'],
    photos: ['gart-1', 'gart-2', 'events-1', 'events-2', 'events-3', 'events-4',
      'competitions-1', 'competitions-2', 'competitions-3', 'competitions-dot-1', 'competitions-dot-2'],
    overlays: [],
    intro: { x: 1051, y: 167, w: 777, h: 241 },
    hoverBoxes: {
      'robotics-hover-gart': { x: 296, y: 178, w: 288, h: 584, glow: 75 },
      'robotics-hover-events': { x: 561, y: 230, w: 351, h: 566, glow: 75 },
      'robotics-hover-competitions': { x: 678, y: 939, w: 263, h: 141, glow: 75 },
    },
  },
  community: {
    frames: ['community-base', ...['zerodong', 'racetrack', 'beacon', 'humanitas', 'bavi', 'cerebral', 'advisor']
      .map((n) => `community-hover-${n}`)],
    photos: ['zerodong-1', 'zerodong-2', 'racetrack-1', 'racetrack-2', 'beacon-1', 'beacon-2', 'humanitas-1',
      'humanitas-2', 'bavi-1', 'bavi-2', 'cerebral-1', 'cerebral-2', 'advisor-1'],
    overlays: [],
    intro: { x: 55, y: 879, w: 1019, h: 188 },
    hoverBoxes: {
      'community-hover-zerodong': { x: 467, y: 46, w: 358, h: 250, glow: 60 },
      'community-hover-racetrack': { x: 863, y: 170, w: 279, h: 91, glow: 40 },
      'community-hover-beacon': { x: 1217, y: -2, w: 369, h: 280, glow: 40 },
      'community-hover-humanitas': { x: 516, y: 347, w: 413, h: 253, glow: 40 },
      'community-hover-bavi': { x: 1068, y: 294, w: 427, h: 288, glow: 40 },
      'community-hover-cerebral': { x: 561, y: 628, w: 384, h: 262, glow: 40 },
      'community-hover-advisor': { x: 1099, y: 644, w: 338, h: 225, glow: 40 },
    },
  },
  // Trang chủ: không có hover; thẻ kính nằm trên ảnh gốc nên cần ảnh mờ của chính ảnh gốc.
  home: {
    frames: ['home-base'],
    blurFrames: ['home-base'],
    photos: ['about-photo'],
    overlays: [],
  },
  iar: {
    frames: ['iar-base', 'iar-hover-posters', 'iar-hover-column', 'iar-hover-laptop', 'iar-hover-robot'],
    photos: ['tekmonk-1', 'tekmonk-2', 'wico-1', 'wico-2', 'other-1', 'other-2', 'vsic-1', 'vsic-2'],
    overlays: [],
    // Figma không có frame hover cho cột đo nước: ghép từ ảnh gốc + layer cột (37:328),
    // phóng 1,112 lần quanh tâm như laptop, bóng trắng radius 40 / 75% như các hover khác của IAR.
    synth: [{ out: 'iar-hover-column', base: 'iar-base', sprite: 'iar-column',
      box: { x: 394, y: 218, w: 110, h: 670 }, hover: { x: 388, y: 181, w: 122, h: 745 }, glow: { radius: 40, opacity: 0.75 } }],
    intro: { x: 21, y: 87, w: 373, h: 428 },
    hoverBoxes: {
      'iar-hover-posters': { x: 300, y: 0, w: 1342, h: 759, glow: 40 },
      'iar-hover-column': { x: 388, y: 181, w: 122, h: 745, glow: 40 },
      'iar-hover-laptop': { x: 1053, y: 458, w: 861, h: 574, glow: 40 },
      'iar-hover-robot': { x: 488, y: 679, w: 432, h: 357, glow: 40 },
    },
  },
};

const STAGE_W = 1920;
const room = process.argv[2];
const cfg = ROOMS[room];
if (!cfg) {
  console.error(`Phòng không hợp lệ: ${room}. Có: ${Object.keys(ROOMS).join(', ')}`);
  process.exit(1);
}
const srcDir = path.join('figma-export', room);
const outDir = path.join('src', 'assets', room);
await mkdir(outDir, { recursive: true });

const synth = cfg.synth ?? [];
const have = new Set((await readdir(srcDir)).map((f) => f.replace(/\.png$/i, '')));
const needed = [
  ...cfg.frames.filter((f) => !synth.some((s) => s.out === f)),
  ...synth.map((s) => s.sprite), ...cfg.photos, ...cfg.overlays.map((o) => o.sprite),
];
const missing = needed.filter((n) => !have.has(n));
if (missing.length) {
  console.error(`Thiếu file trong ${srcDir}: ${missing.map((n) => n + '.png').join(', ')}`);
  process.exit(1);
}

// Ảnh ghép tạm nằm ở .figma-tmp/ (không commit), không ghi vào thư mục xuất của bạn.
const tmpDir = path.join('.figma-tmp', room);
await mkdir(tmpDir, { recursive: true });
const png = (name) => path.join(synth.some((s) => s.out === name) ? tmpDir : srcDir, `${name}.png`);

// Ghép ảnh hover: ảnh gốc + layer đồ vật phóng to + bóng trắng (DROP_SHADOW offset 0 của Figma,
// blur radius R ≈ Gaussian sigma R/2).
for (const s of synth) {
  const { width: W } = await sharp(png(s.base)).metadata();
  const k = W / STAGE_W;
  const w = Math.round(s.hover.w * k), h = Math.round(s.hover.h * k);
  const sigma = (s.glow.radius / 2) * k;
  const pad = Math.ceil(sigma * 3);
  const sprite = await sharp(png(s.sprite)).resize(w, h, { fit: 'fill' }).ensureAlpha().png().toBuffer();
  const padded = await sharp(sprite).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toBuffer();
  const alpha = await sharp(padded).extractChannel(3).linear(s.glow.opacity, 0).blur(sigma).toBuffer();
  const glow = await sharp({ create: { width: w + 2 * pad, height: h + 2 * pad, channels: 3, background: '#fff' } })
    .joinChannel(alpha).png().toBuffer();
  const x = Math.round(s.hover.x * k), y = Math.round(s.hover.y * k);
  await sharp(png(s.base))
    .composite([{ input: glow, left: x - pad, top: y - pad }, { input: sprite, left: x, top: y }])
    .png().toFile(png(s.out));
  console.log(`Đã ghép ${s.out}.png từ ${s.base} + ${s.sprite}`);
}

// Kiểm tra ảnh hover so với ảnh gốc:
// - Ngoài vùng đồ vật (+ bóng) và khung giới thiệu: phải giống nhau (không lệch nền, menu…).
// - Trong khung giới thiệu: phải khác (ảnh hover không được còn khung giới thiệu).
async function checkHover(frame, hb) {
  const read = async (n) => (await sharp(png(n)).resize({ width: STAGE_W / 4 }).removeAlpha().raw().toBuffer());
  const [a, b] = await Promise.all([read(cfg.frames[0]), read(frame)]);
  const W = STAGE_W / 4, s = 4, m = hb.glow * 1.5, it = cfg.intro;
  const inBox = (x, y, r, pad = 0) => x >= r.x - pad && x <= r.x + r.w + pad && y >= r.y - pad && y <= r.y + r.h + pad;
  let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, introDiff = 0, introAll = 0;
  for (let i = 0; i < a.length; i += 3) {
    const x = ((i / 3) % W) * s, y = Math.floor(i / 3 / W) * s;
    const diff = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) >= 30;
    if (inBox(x, y, hb, m)) continue;
    if (it && inBox(x, y, it, 8)) { introAll++; if (diff) introDiff++; continue; }
    if (!diff) continue;
    n++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  const ok = [];
  if (n > 20) console.warn(`CẢNH BÁO ${frame}: khác ảnh gốc ngoài vùng đồ vật ở khoảng (${x0},${y0})–(${x1},${y1}), ${n} điểm. Kiểm tra lại nền / layer.`);
  else ok.push('nền khớp ảnh gốc');
  if (it && introDiff < introAll * 0.05) console.warn(`CẢNH BÁO ${frame}: khung giới thiệu vẫn còn trong ảnh hover (cần ẩn trước khi xuất).`);
  else if (it) ok.push('không còn khung giới thiệu');
  if (ok.length === (it ? 2 : 1)) console.log(`${frame}: ${ok.join(', ')} ✓`);
}
for (const [frame, hb] of Object.entries(cfg.hoverBoxes ?? {})) await checkHover(frame, hb);
async function toWebp(name, outName, width) {
  const img = sharp(png(name));
  if (width) img.resize({ width });
  const info = await img.webp({ quality: 80 }).toFile(path.join(outDir, `${outName}.webp`));
  console.log(`${outName}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
}

// Bản -2x (3840) cho màn hình mật độ cao: sân khấu tối đa 1920 CSS px, nên 2x là đủ.
// Mọi frame cùng có -2x để ảnh gốc và ảnh hover nét như nhau khi crossfade.
for (const f of cfg.frames) {
  const { width } = await sharp(png(f)).metadata();
  if (width >= STAGE_W * 2) await toWebp(f, `${f}-2x`, STAGE_W * 2);
  else console.warn(`${f}.png chỉ rộng ${width}px: không tạo bản -2x (cần xuất ≥ 2x)`);
  await toWebp(f, f, STAGE_W);
  await toWebp(f, `${f}-sm`, STAGE_W / 2);
}

// Nền mờ sẵn cho thẻ kính: thay cho backdrop-filter (tính lại mỗi khung hình nên làm giật).
// Nền sau pop-up là ảnh hover tĩnh nên làm mờ trước cho kết quả giống hệt.
// Sigma đo bằng cách khớp với ảnh đối chiếu figma-export/sports/ref/1-74.png:
// sigma 8 ở 1920 (GLASS radius 15 của Figma ≈ 2 × sigma), không đổi độ bão hòa,
// phủ trắng 10% làm ở CSS (.glass::after). Sai khác trung bình 1,74/255.
const GLASS_SIGMA = 8;
for (const f of cfg.blurFrames ?? cfg.frames.filter((n) => n !== cfg.frames[0])) {
  for (const [suffix, width] of [['', STAGE_W], ['-sm', STAGE_W / 2]]) {
    const out = `${f}-blur${suffix}`;
    const info = await sharp(png(f))
      .resize({ width })
      .blur(GLASS_SIGMA * (width / STAGE_W))
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${out}.webp`));
    console.log(`${out}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}
for (const p of cfg.photos) await toWebp(p, p);

// Khớp sprite (có alpha) với ảnh frame: chỉ so các điểm gần như đặc (alpha > 250),
// tức là thân đồ vật, bỏ qua phần bóng mờ. Dò thô ở 1/8 rồi tinh chỉnh ở độ phân giải gốc.
async function raw(file, scale) {
  const m = await sharp(file).metadata();
  const { data, info } = await sharp(file)
    .resize(Math.round(m.width * scale), Math.round(m.height * scale), { kernel: 'cubic' })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, srcW: m.width };
}

function score(frame, sprite, ox, oy, step) {
  let sum = 0, n = 0;
  for (let y = 0; y < sprite.h; y += step) {
    const fy = y + oy;
    if (fy < 0 || fy >= frame.h) continue;
    for (let x = 0; x < sprite.w; x += step) {
      const fx = x + ox;
      if (fx < 0 || fx >= frame.w) continue;
      const si = (y * sprite.w + x) * 4;
      if (sprite.data[si + 3] < 250) continue;
      const fi = (fy * frame.w + fx) * 4;
      sum += Math.abs(sprite.data[si] - frame.data[fi]) + Math.abs(sprite.data[si + 1] - frame.data[fi + 1])
        + Math.abs(sprite.data[si + 2] - frame.data[fi + 2]);
      n++;
    }
  }
  return n > 50 ? sum / n / 3 : Infinity;
}

function search(frame, sprite, cx, cy, radius, step) {
  let best = { x: cx, y: cy, s: Infinity };
  for (let oy = cy - radius; oy <= cy + radius; oy++) {
    for (let ox = cx - radius; ox <= cx + radius; ox++) {
      const s = score(frame, sprite, ox, oy, step);
      if (s < best.s) best = { x: ox, y: oy, s };
    }
  }
  return best;
}

const overlays = {};
for (const o of cfg.overlays) {
  const meta = await sharp(png(o.frame)).metadata();
  const frameScale = meta.width / STAGE_W; // 2 nếu xuất 2x
  const spriteMeta = await sharp(png(o.sprite)).metadata();
  const w1 = spriteMeta.width / frameScale;
  const h1 = spriteMeta.height / frameScale;
  // Đoán ban đầu: sprite đặt giữa khung layer (bóng lan đều).
  const gx = o.guess.x - (w1 - o.guess.w) / 2;
  const gy = o.guess.y - (h1 - o.guess.h) / 2;

  const k = 1 / 8;
  const fC = await raw(png(o.frame), k);
  const sC = await raw(png(o.sprite), k);
  const coarse = search(fC, sC, Math.round(gx * frameScale * k), Math.round(gy * frameScale * k), 25, 1);

  const fF = await raw(png(o.frame), 1);
  const sF = await raw(png(o.sprite), 1);
  const fine = search(fF, sF, Math.round(coarse.x / k), Math.round(coarse.y / k), 10, 3);

  const box = { x: fine.x / frameScale, y: fine.y / frameScale, w: w1, h: h1 };
  overlays[o.sprite] = box;
  console.log(`${o.sprite}: ${JSON.stringify(box)} (sai khác màu trung bình ${fine.s.toFixed(2)}/255; đoán ban đầu ${gx.toFixed(1)},${gy.toFixed(1)})`);
  await toWebp(o.sprite, o.sprite);
}
await writeFile(path.join(outDir, 'overlays.json'), JSON.stringify(overlays, null, 2) + '\n');
console.log(`Đã ghi ${outDir}/overlays.json`);
