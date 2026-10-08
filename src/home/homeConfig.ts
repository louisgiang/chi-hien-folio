import type { Box } from '../room/types';

// Trang chủ (máy game). Frame gốc 25:44; thẻ About Me 25:76, How to Play 25:103,
// Select the Memory 25:126. Prototype chưa nối gì: nối menu + chọn phòng theo quyết định 2026-10-08.
// Không làm chuyển động cho D-pad / phím mũi tên (brief, quy tắc 5).
const PENDING = ' … [chờ nội dung]';

export type HomePanelId = 'about' | 'howto' | 'select';

export const home = {
  id: 'home',
  base: 'home-base',
  blur: 'home-base-blur',
  // Chữ menu đã in sẵn trong ảnh nền: ô trong suốt theo vị trí chữ.
  menu: [
    { panel: 'about', label: 'About Me', box: { x: 594, y: 640, w: 118, h: 55 } },
    { panel: 'select', label: 'Select the Memory', box: { x: 846, y: 640, w: 244, h: 55 } },
    { panel: 'howto', label: 'How to Play', box: { x: 1224, y: 640, w: 151, h: 55 } },
  ] satisfies { panel: HomePanelId; label: string; box: Box }[],
  about: {
    glass: { x: 725, y: 134, w: 777, h: 444 },
    text: { box: { x: 751, y: 159, w: 686, h: 134 }, text: 'I am Truong Chi Hien, currentl' + PENDING },
    // image 18, có DROP_SHADOW 4px đen 25%.
    photo: { asset: 'about-photo', alt: 'Trương Chí Hiển', box: { x: 333, y: 134, w: 351, h: 460 } },
  },
  howto: {
    glass: { x: 370, y: 147, w: 1180, h: 444 },
    title: { box: { x: 435, y: 161, w: 291, h: 107 }, text: 'How to Play' },
    text: { box: { x: 413, y: 310, w: 1042, h: 227 }, text: 'Click on "About Me" to get a g' + PENDING },
  },
  select: {
    glass: { x: 370, y: 141, w: 1180, h: 444 },
    // Bốn tên phòng có bóng cứng màu #cc6b24 (DROP_SHADOW radius 0) như chữ "Chi Hien's Folio".
    options: [
      { to: '#/robotics', text: 'Robotics', box: { x: 847, y: 177, w: 180, h: 87 } },
      { to: '#/iar', text: 'Innovation and Research', box: { x: 682, y: 281, w: 512, h: 87 } },
      { to: '#/sports', text: 'Sports', box: { x: 870, y: 366, w: 135, h: 87 } },
      { to: '#/community', text: 'Community Services', box: { x: 737, y: 453, w: 400, h: 87 } },
    ],
  },
};
