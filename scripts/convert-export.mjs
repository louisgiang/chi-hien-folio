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

const have = new Set((await readdir(srcDir)).map((f) => f.replace(/\.png$/i, '')));
const missing = [...cfg.frames, ...cfg.photos, ...cfg.overlays.map((o) => o.sprite)].filter((n) => !have.has(n));
if (missing.length) {
  console.error(`Thiếu file trong ${srcDir}: ${missing.map((n) => n + '.png').join(', ')}`);
  process.exit(1);
}

const png = (name) => path.join(srcDir, `${name}.png`);
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
for (const f of cfg.frames.filter((n) => n !== cfg.frames[0])) {
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
