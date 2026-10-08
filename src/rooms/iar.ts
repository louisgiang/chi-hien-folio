import { navLinks } from '../room/nav';
import type { RoomConfig } from '../room/types';

// Phòng Innovation & Research. Frame gốc 32:475 (đã duyệt, bỏ 33:2 / 33:17).
// Hover 33:62 / 33:32 / 33:47; cột đo nước không có frame hover trong Figma:
// ảnh hover của cột do scripts/convert-export.mjs ghép (bóng trắng r40, 75%). Xem NOTES.md.
// Thứ tự ô: tường poster nằm dưới cùng vì cột và laptop đè lên vùng của nó.
const PENDING = ' … [chờ nội dung]';

export const iar: RoomConfig = {
  id: 'iar',
  name: 'Innovation and Research',
  base: 'iar-base',
  links: navLinks('iar'),
  objects: [
    {
      id: 'posters',
      label: 'Tường poster: Tekmonk',
      frame: 'iar-hover-posters',
      base: { x: 352, y: 0, w: 1238, h: 700 },
      hover: { x: 300, y: 0, w: 1342, h: 759 },
      popup: 'tekmonk',
    },
    {
      id: 'column',
      label: 'Cột đo nước: WICO',
      frame: 'iar-hover-column',
      base: { x: 394, y: 218, w: 110, h: 670 },
      // Phóng 1,112 lần quanh tâm như laptop (774 → 861), vì Figma không có frame hover.
      hover: { x: 388, y: 181, w: 122, h: 745 },
      popup: 'wico',
    },
    {
      id: 'laptop',
      label: 'Laptop: Other research',
      frame: 'iar-hover-laptop',
      base: { x: 1096, y: 487, w: 774, h: 516 },
      hover: { x: 1053, y: 458, w: 861, h: 574 },
      popup: 'other',
    },
    {
      id: 'robot',
      label: 'Robot: VSIC',
      frame: 'iar-hover-robot',
      base: { x: 531, y: 720, w: 352, h: 291 },
      hover: { x: 488, y: 679, w: 432, h: 357 },
      popup: 'vsic',
    },
  ],
  popups: [
    {
      id: 'tekmonk', object: 'posters',
      glass: { x: 53, y: 94, w: 888, h: 891 },
      title: { text: 'Tekmonk', box: { x: 79, y: 180, w: 252, h: 74 } },
      texts: [{ box: { x: 79, y: 269, w: 835, h: 90 }, text: 'This programming research' + PENDING }],
      images: [
        { asset: 'tekmonk-1', alt: 'Tekmonk 1', box: { x: 79, y: 429, w: 390, h: 296 } },
        { asset: 'tekmonk-2', alt: 'Tekmonk 2', box: { x: 482, y: 425, w: 401, h: 303 } },
      ],
    },
    {
      id: 'wico', object: 'column',
      glass: { x: 673, y: 218, w: 1120, h: 744 },
      title: { text: 'WIco', box: { x: 703, y: 268, w: 116, h: 62 } },
      texts: [{ box: { x: 703, y: 338, w: 943, h: 75 }, text: 'WICO 2026 is by far the bi' + PENDING }],
      images: [
        { asset: 'wico-1', alt: 'WICO 2026', box: { x: 704, y: 448, w: 401, h: 303 } },
        { asset: 'wico-2', alt: 'WICO 2026 Gold Award', box: { x: 1120, y: 750, w: 302, h: 445 } },
      ],
    },
    {
      id: 'other', object: 'laptop',
      glass: { x: 55, y: 86, w: 1120, h: 744 },
      title: { text: 'Other research', box: { x: 85, y: 136, w: 374, h: 62 } },
      texts: [{ box: { x: 85, y: 206, w: 943, h: 168 }, text: 'Research at Hanoi Univer' + PENDING }],
      images: [
        { asset: 'other-1', alt: 'Other research 1', box: { x: 570, y: 386, w: 442, h: 335 } },
        { asset: 'other-2', alt: 'Other research 2', box: { x: 85, y: 720, w: 334, h: 476 } },
      ],
    },
    {
      id: 'vsic', object: 'robot',
      glass: { x: 947, y: 95, w: 888, h: 891 },
      title: { text: 'VSIC', box: { x: 971, y: 155, w: 252, h: 74 } },
      texts: [{ box: { x: 971, y: 244, w: 835, h: 90 }, text: 'This research competitio' + PENDING }],
      images: [
        { asset: 'vsic-1', alt: 'VSIC 1', box: { x: 971, y: 404, w: 390, h: 296 } },
        { asset: 'vsic-2', alt: 'VSIC 2', box: { x: 1380, y: 404, w: 206, h: 296 } },
      ],
    },
  ],
};
