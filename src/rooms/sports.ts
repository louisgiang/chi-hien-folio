import type { RoomConfig } from '../room/types';
import overlays from '../assets/sports/overlays.json';

// Phòng Sports. Frame gốc 1:7; hover 1:61 / 1:35 / 1:20; pop-up 1:74 / 1:92 / 1:111.
// Ảnh full-frame và ảnh pop-up xuất tay từ Figma (figma-export/sports/).
// Tọa độ ô hover lấy từ Plugin API ngày 2026-10-08. Những chỗ còn đoán: xem NOTES.md.

export const sports: RoomConfig = {
  id: 'sports',
  name: 'Sports',
  base: 'sports-base',
  overlays,
  objects: [
    {
      id: 'racket',
      label: 'Vợt cầu lông: Badminton',
      frame: 'sports-hover-racket',
      base: { x: 0, y: 330, w: 427, h: 750 },
      hover: { x: -15, y: 278, w: 457, h: 802 },
      popup: 'badminton',
    },
    {
      id: 'shoes',
      label: 'Đôi giày: Soccer',
      frame: 'sports-hover-ball',
      base: { x: 446, y: 355, w: 399, h: 486 },
      hover: { x: 429, y: 334, w: 433, h: 528 },
      popup: 'soccer',
    },
    {
      id: 'whistle',
      label: 'Chìa khóa: Swimming',
      frame: 'sports-hover-goggles',
      base: { x: 1339, y: 733, w: 101, h: 87 },
      hover: { x: 1314, y: 711, w: 151, h: 131 },
      popup: 'swimming',
    },
  ],
  popups: [
    {
      id: 'badminton',
      object: 'racket',
      // 1:74: cây vợt nằm trên thẻ kính (giữ theo yêu cầu).
      overlay: 'badminton-above-racket',
      glass: { x: 499, y: 131, w: 1019, h: 895 },
      title: { text: 'Badminton', box: { x: 529, y: 168, w: 248, h: 62 } },
      body: {
        box: { x: 529, y: 238, w: 943, h: 75 },
        text:
          "Although badminton hasn't always been my first choice, I fell in love with it after I could no longer play soccer to the best of my ability due to my collarbone injury. I ended up joining the school's badminton club and participated in 2 tournaments.",
      },
      images: [
        { asset: 'badminton-1', alt: 'Badminton 1', box: { x: 529, y: 336, w: 446, h: 338 } },
        { asset: 'badminton-2', alt: 'Badminton 2', box: { x: 1009, y: 336, w: 446, h: 338 } },
      ],
    },
    {
      id: 'soccer',
      object: 'shoes',
      // 1:92: đôi giày cũng nằm trên thẻ kính theo thứ tự layer (đè ~17px mép trái).
      overlay: 'soccer-above-ball',
      glass: { x: 845, y: 92, w: 1019, h: 895 },
      title: { text: 'Soccer', box: { x: 875, y: 142, w: 169, h: 62 } },
      body: {
        box: { x: 875, y: 212, w: 943, h: 75 },
        text:
          'Every Sunday, my father would take me to soccer practice, and it introduced me to the competitive side of sports. It also taught me that teamwork makes the dream work.',
      },
      images: [
        { asset: 'soccer-1', alt: 'Soccer 1', box: { x: 875, y: 287, w: 445, h: 337 } },
        { asset: 'soccer-2', alt: 'Soccer 2', box: { x: 1353, y: 287, w: 445, h: 337 } },
      ],
    },
    {
      id: 'swimming',
      object: 'whistle',
      // 1:111: đồ vật nằm dưới thẻ kính. Nền là ảnh hover 1:20 nên không còn "vàng (ele 1)" sáng nhầm.
      glass: { x: 845, y: 133, w: 1019, h: 895 },
      title: { text: 'Swimming', box: { x: 876, y: 181, w: 229, h: 62 } },
      body: {
        box: { x: 876, y: 251, w: 896, h: 75 },
        text:
          'When we were kids, my father used to take my brother and me to the local swimming pool for lessons. Once we learned to swim, he would drop the locker keys into the water to teach us how to dive.',
      },
      images: [
        { asset: 'swimming-1', alt: 'Swimming 1', box: { x: 875, y: 340, w: 475, h: 359 } },
        { asset: 'swimming-2', alt: 'Swimming 2', box: { x: 1360, y: 340, w: 475, h: 359 } },
      ],
    },
  ],
};
