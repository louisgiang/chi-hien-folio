import { navLinks } from '../room/nav';
import type { RoomConfig } from '../room/types';

// Phòng Innovation & Research. Frame gốc 32:475 (đã duyệt, bỏ 33:2 / 33:17).
// Hover 33:62 / 33:32 / 33:47; cột đo nước không có frame hover trong Figma:
// ảnh hover của cột do scripts/convert-export.mjs ghép (bóng trắng r40, 75%). Xem NOTES.md.
// Thứ tự ô: tường poster nằm dưới cùng vì cột và laptop đè lên vùng của nó.
// Chữ pop-up: chép nguyên văn người dùng gửi (2026-10-09), đối chiếu ref 33-137/33-77/33-97/33-117.

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
      texts: [{ box: { x: 79, y: 269, w: 835, h: 90 }, text: "This programming research competition was the first, and longest-running, contest I've ever participated in. We made it all the way to the National Round and won the Promising Award with a LinkedIn and Google Maps crossover project." }],
      images: [
        { asset: 'tekmonk-1', alt: 'Tekmonk 1', box: { x: 79, y: 429, w: 390, h: 296 } },
        { asset: 'tekmonk-2', alt: 'Tekmonk 2', box: { x: 482, y: 425, w: 401, h: 303 } },
      ],
    },
    {
      id: 'wico', object: 'column',
      // Nới rộng khớp ref 33-77 (thẻ kính rộng, hai ảnh nằm nửa trái).
      glass: { x: 667, y: 221, w: 1215, h: 734 },
      title: { text: 'WIco', box: { x: 703, y: 268, w: 116, h: 62 } },
      texts: [{ box: { x: 703, y: 338, w: 943, h: 75 }, text: "WICO 2026 is by far the biggest research competition I've taken part in, with more than 1,000 participants from 26 countries. I was immensely proud to lead my team to a gold medal with our water testing device." }],
      images: [
        { asset: 'wico-1', alt: 'WICO 2026', box: { x: 704, y: 448, w: 401, h: 303 } },
        // Đo lại từ ref 33-77: huy chương + giấy Gold Award nằm NGANG bên phải (trước đây để dọc bên dưới).
        { asset: 'wico-2', alt: 'WICO 2026 Gold Award', box: { x: 1128, y: 446, w: 408, h: 293 } },
      ],
    },
    {
      id: 'other', object: 'laptop',
      glass: { x: 55, y: 86, w: 1120, h: 744 },
      title: { text: 'Other research', box: { x: 85, y: 136, w: 374, h: 62 } },
      // Hai khối, mỗi khối tiêu đề gạch chân + một câu. ("here" trong thiết kế là link gạch chân — xem NOTES.)
      texts: [
        {
          box: { x: 85, y: 206, w: 943, h: 100 },
          heading: 'Research at Hanoi University of Science and Technology',
          underline: true,
          text: 'You can see our research paper on an AI-powered mobile framework for bidirectional sign-language communication here.',
        },
        {
          box: { x: 85, y: 320, w: 943, h: 100 },
          heading: 'Research at 13th Vietnam Summer School of Science',
          underline: true,
          text: "You can see our research paper on a model for improving and strengthening AI's role in self-study and homework completion here.",
        },
      ],
      images: [
        // Đo lại từ ref 33-97: cert (other-2) bên TRÁI, ảnh nhóm (other-1) bên PHẢI, cạnh nhau.
        { asset: 'other-2', alt: 'Other research certificate', box: { x: 86, y: 398, w: 466, h: 312 } },
        { asset: 'other-1', alt: 'Other research team', box: { x: 571, y: 398, w: 442, h: 312 } },
      ],
    },
    {
      id: 'vsic', object: 'robot',
      glass: { x: 947, y: 95, w: 888, h: 891 },
      title: { text: 'VSIC', box: { x: 971, y: 155, w: 252, h: 74 } },
      texts: [{ box: { x: 971, y: 244, w: 835, h: 90 }, text: "This research competition was a humbling experience, as we only received the Consolation Prize out of 28 teams in the division. Despite that, I still felt proud of our air monitoring robot and grateful for all the judges' feedback." }],
      images: [
        { asset: 'vsic-1', alt: 'VSIC 1', box: { x: 971, y: 404, w: 390, h: 296 } },
        { asset: 'vsic-2', alt: 'VSIC 2', box: { x: 1380, y: 404, w: 206, h: 296 } },
      ],
    },
  ],
};
