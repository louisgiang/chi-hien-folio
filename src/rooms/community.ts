import { navLinks } from '../room/nav';
import type { RoomConfig } from '../room/types';

// Phòng Community Services. Frame gốc 25:170. 7 đồ vật đều tên "Không Có Tiêu Đề…",
// phân biệt bằng vị trí. Hover / pop-up theo bảng ở NOTES.md.
// 25:285 có một đồ vật bị nền che (lỗi Figma): không ảnh hưởng vì nền pop-up là ảnh hover 25:141.
const PENDING = ' … [chờ nội dung]';

const obj = (id: string, label: string, base: [number, number, number, number], hover: [number, number, number, number]) => ({
  id, label, popup: id, frame: `community-hover-${id}`,
  base: { x: base[0], y: base[1], w: base[2], h: base[3] },
  hover: { x: hover[0], y: hover[1], w: hover[2], h: hover[3] },
});

export const community: RoomConfig = {
  id: 'community',
  name: 'Community Services',
  base: 'community-base',
  links: navLinks('community'),
  objects: [
    obj('zerodong', '"Zero-Dong" Charity Fair', [493, 64, 306, 214], [467, 46, 358, 250]),
    obj('racetrack', '"Blue Racetrack" Swimming', [912, 186, 181, 59], [863, 170, 279, 91]),
    obj('beacon', 'BeaconInRain SOS Alert', [1242, 17, 319, 242], [1217, -2, 369, 280]),
    obj('humanitas', 'Humanitas', [533, 357, 379, 233], [516, 347, 413, 253]),
    obj('bavi', 'Volunteer Work in Ba Vì', [1081, 303, 401, 270], [1068, 294, 427, 288]),
    obj('cerebral', 'Cerebral Palsy Family', [577, 639, 352, 240], [561, 628, 384, 262]),
    obj('advisor', 'Advisor-Advisee 2025', [1114, 654, 308, 205], [1099, 644, 338, 225]),
  ],
  popups: [
    {
      id: 'zerodong', object: 'zerodong',
      glass: { x: 825, y: 296, w: 1019, h: 744 },
      title: { text: '"Zero-Dong" Charity Fa' + PENDING, box: { x: 855, y: 346, w: 587, h: 62 } },
      texts: [{ box: { x: 855, y: 416, w: 943, h: 75 }, text: "The 'Zero-Dong' Charit" + PENDING }],
      images: [
        { asset: 'zerodong-1', alt: 'Zero-Dong Charity Fair 1', box: { x: 856, y: 526, w: 401, h: 303 } },
        { asset: 'zerodong-2', alt: 'Zero-Dong Charity Fair 2', box: { x: 1279, y: 828, w: 305, h: 441 } },
      ],
    },
    {
      id: 'racetrack', object: 'racetrack',
      glass: { x: 816, y: 303, w: 1019, h: 744 },
      title: { text: '"Blue Racetrack" Swimm' + PENDING, box: { x: 846, y: 353, w: 897, h: 62 } },
      texts: [{ box: { x: 846, y: 423, w: 943, h: 75 }, text: 'Since I had a great re' + PENDING }],
      images: [
        { asset: 'racetrack-1', alt: 'Blue Racetrack 1', box: { x: 850, y: 543, w: 401, h: 303 } },
        { asset: 'racetrack-2', alt: 'Blue Racetrack 2', box: { x: 1276, y: 543, w: 401, h: 303 } },
      ],
    },
    {
      id: 'beacon', object: 'beacon',
      glass: { x: 56, y: 92, w: 1019, h: 895 },
      title: { text: 'BeaconInRain SOS Ale' + PENDING, box: { x: 86, y: 142, w: 721, h: 62 } },
      texts: [{ box: { x: 86, y: 226, w: 943, h: 75 }, text: 'After witnessing first' + PENDING }],
      images: [
        { asset: 'beacon-1', alt: 'BeaconInRain 1', box: { x: 86, y: 301, w: 466, h: 353 } },
        { asset: 'beacon-2', alt: 'BeaconInRain 2', box: { x: 588, y: 301, w: 467, h: 353 } },
      ],
    },
    {
      id: 'humanitas', object: 'humanitas',
      glass: { x: 929, y: 125, w: 929, h: 895 },
      title: { text: 'Humanitas', box: { x: 959, y: 175, w: 246, h: 62 } },
      texts: [{ box: { x: 959, y: 259, w: 848, h: 75 }, text: 'Our team arrived at an' + PENDING }],
      images: [
        { asset: 'humanitas-1', alt: 'Humanitas 1', box: { x: 960, y: 356, w: 435, h: 329 } },
        { asset: 'humanitas-2', alt: 'Humanitas 2', box: { x: 1400, y: 356, w: 435, h: 330 } },
      ],
    },
    {
      id: 'bavi', object: 'bavi',
      glass: { x: 74, y: 111, w: 929, h: 895 },
      title: { text: 'Volunteer Work in Ba V' + PENDING, box: { x: 104, y: 161, w: 556, h: 62 } },
      texts: [{ box: { x: 104, y: 245, w: 848, h: 75 }, text: 'While working to suppo' + PENDING }],
      images: [
        { asset: 'bavi-1', alt: 'Ba Vì 1', box: { x: 104, y: 361, w: 409, h: 309 } },
        { asset: 'bavi-2', alt: 'Ba Vì 2', box: { x: 543, y: 361, w: 409, h: 309 } },
      ],
    },
    {
      id: 'cerebral', object: 'cerebral',
      glass: { x: 866, y: 107, w: 1019, h: 895 },
      // Khung tiêu đề cao 124px = 2 dòng: cần biết chỗ xuống dòng.
      title: { text: 'Cerebral Palsy Famil' + PENDING, box: { x: 896, y: 157, w: 523, h: 124 } },
      texts: [{ box: { x: 896, y: 314, w: 943, h: 75 }, text: 'Despite having known' + PENDING }],
      images: [
        { asset: 'cerebral-1', alt: 'Cerebral Palsy Family 1', box: { x: 896, y: 419, w: 446, h: 338 } },
        { asset: 'cerebral-2', alt: 'Cerebral Palsy Family 2', box: { x: 1376, y: 419, w: 447, h: 338 } },
      ],
    },
    {
      id: 'advisor', object: 'advisor',
      glass: { x: 55, y: 92, w: 1019, h: 895 },
      title: { text: 'Advisor-Advisee 2025', box: { x: 85, y: 142, w: 501, h: 62 } },
      texts: [{ box: { x: 85, y: 216, w: 943, h: 75 }, text: 'I used to have nightma' + PENDING }],
      images: [{ asset: 'advisor-1', alt: 'Advisor-Advisee 2025', box: { x: 85, y: 746, w: 411, h: 589 } }],
    },
  ],
};
