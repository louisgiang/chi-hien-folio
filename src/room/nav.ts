import type { RoomLink } from './types';

// Menu trên cùng của các phòng (đã in sẵn trong ảnh full-frame): ô trong suốt theo vị trí chữ.
// Vị trí giống nhau ở mọi phòng (y = 25, cao 27). Đã duyệt: nối hết (2026-10-08).
const ITEMS: (RoomLink & { key: string })[] = [
  { key: 'home', label: "Chi Hien's Folio: về trang chủ", box: { x: 55, y: 25, w: 152, h: 27 }, to: '#/' },
  { key: 'about', label: 'About Me', box: { x: 819, y: 25, w: 93, h: 27 }, to: '#/about' },
  { key: 'robotics', label: 'Robotics', box: { x: 947, y: 25, w: 93, h: 27 }, to: '#/robotics' },
  { key: 'iar', label: 'Innovation and Research', box: { x: 1075, y: 25, w: 253, h: 27 }, to: '#/iar' },
  { key: 'sports', label: 'Sports', box: { x: 1363, y: 25, w: 74, h: 27 }, to: '#/sports' },
  { key: 'community', label: 'Community Services', box: { x: 1472, y: 25, w: 205, h: 27 }, to: '#/community' },
  { key: 'howto', label: 'How to Play', box: { x: 1712, y: 25, w: 123, h: 27 }, to: '#/howto' },
];

/** Các mục menu trừ phòng hiện tại. */
export const navLinks = (current: string): RoomLink[] =>
  ITEMS.filter((i) => i.key !== current).map(({ key: _key, ...link }) => link);
