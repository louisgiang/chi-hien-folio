import type { RoomConfig } from '../room/types';

// Phòng Robotics. Frame gốc 6:28; hover 6:52 / 6:68 / 6:84; pop-up 6:117 / 6:212 / 6:237.
// IMG_3705 (cột giữa) đứng tĩnh, không có ô hover. Những chỗ còn đoán: xem NOTES.md.
const PENDING = ' … [chờ nội dung]';

export const robotics: RoomConfig = {
  id: 'robotics',
  name: 'Robotics',
  base: 'robotics-base',
  // Prototype: chữ "Sports" (6:36) trên menu, click → 1:7.
  links: [{ label: 'Sports', box: { x: 1363, y: 25, w: 74, h: 27 }, to: '#/sports' }],
  objects: [
    {
      id: 'gart',
      label: 'IMG_3706: GArt',
      frame: 'robotics-hover-gart',
      base: { x: 317, y: 220, w: 246, h: 500 },
      hover: { x: 296, y: 178, w: 288, h: 584 },
      popup: 'gart',
    },
    {
      id: 'events',
      label: 'IMG_3707: Community Events',
      frame: 'robotics-hover-events',
      base: { x: 584, y: 267, w: 305, h: 492 },
      hover: { x: 561, y: 230, w: 351, h: 566 },
      popup: 'events',
    },
    {
      id: 'competitions',
      label: 'IMG_3708: Competitions',
      frame: 'robotics-hover-competitions',
      base: { x: 707, y: 970, w: 205, h: 110 },
      hover: { x: 678, y: 939, w: 263, h: 141 },
      popup: 'competitions',
    },
  ],
  popups: [
    {
      id: 'gart',
      object: 'gart',
      glass: { x: 736, y: 130, w: 1019, h: 895 },
      title: { text: 'GArt', box: { x: 766, y: 180, w: 113, h: 62 } },
      texts: [
        { box: { x: 766, y: 296, w: 422, h: 103 }, text: 'GART Expo 2025  This is where' + PENDING },
        { box: { x: 1261, y: 296, w: 422, h: 199 }, text: 'GART Expo 2026 This year, I re' + PENDING },
      ],
      images: [
        { asset: 'gart-1', alt: 'GART Expo 2026', box: { x: 1261, y: 495, w: 386, h: 256 } },
        { asset: 'gart-2', alt: 'GART Expo 2025', box: { x: 765, y: 751, w: 256, h: 355 } },
      ],
    },
    {
      id: 'events',
      object: 'events',
      glass: { x: 891, y: 92, w: 1019, h: 895 },
      title: { text: 'Community Events', box: { x: 921, y: 129, w: 429, h: 62 } },
      texts: [
        { box: { x: 921, y: 212, w: 943, h: 102 }, text: 'Robotics for Good Youth Challe' + PENDING },
        { box: { x: 928, y: 674, w: 448, h: 192 }, text: 'STEM day at Tran Duy Hung Seco' + PENDING },
      ],
      images: [
        { asset: 'events-1', alt: 'Robotics for Good 1', box: { x: 928, y: 373, w: 349, h: 198 } },
        { asset: 'events-2', alt: 'Robotics for Good 2', box: { x: 1284, y: 373, w: 287, h: 198 } },
        { asset: 'events-3', alt: 'Robotics for Good 3', box: { x: 1582, y: 373, w: 290, h: 201 } },
        { asset: 'events-4', alt: 'STEM day', box: { x: 1392, y: 933, w: 260, h: 363 } },
      ],
    },
    {
      id: 'competitions',
      object: 'competitions',
      glass: { x: 76, y: 83, w: 1019, h: 856 },
      title: { text: 'Competitions', box: { x: 106, y: 118, w: 314, h: 60 } },
      texts: [
        { box: { x: 106, y: 198, w: 943, h: 328 }, text: 'VEX V5 Robotics Competition Ro' + PENDING },
        { box: { x: 106, y: 556, w: 943, h: 328 }, text: '2025-2026 Asia Open Signature ' + PENDING },
      ],
      images: [
        { asset: 'competitions-1', alt: 'VEX V5', box: { x: 138, y: 307, w: 362, h: 220 } },
        { asset: 'competitions-2', alt: 'Asia Open 1', box: { x: 138, y: 656, w: 164, h: 230 } },
        { asset: 'competitions-3', alt: 'Asia Open 2', box: { x: 316, y: 656, w: 164, h: 230 } },
        // Ellipse 1 / 2 (14×14) dưới ảnh: chấm trang trí, xuất như ảnh để đúng màu.
        { asset: 'competitions-dot-1', alt: '', box: { x: 138, y: 904, w: 14, h: 14 } },
        { asset: 'competitions-dot-2', alt: '', box: { x: 155, y: 904, w: 14, h: 14 } },
      ],
    },
  ],
};
