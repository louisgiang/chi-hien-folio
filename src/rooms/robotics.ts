import { navLinks } from '../room/nav';
import type { RoomConfig } from '../room/types';

// Phòng Robotics. Frame gốc 6:28; hover 6:52 / 6:68 / 6:84; pop-up 6:117 / 6:212 / 6:237.
// IMG_3705 (cột giữa) đứng tĩnh, không có ô hover.
// Chữ pop-up: chép nguyên văn từ người dùng (2026-10-09), đối chiếu ref 6-117/6-212/6-237.
// Những chỗ còn đoán: xem NOTES.md.

export const robotics: RoomConfig = {
  id: 'robotics',
  name: 'Robotics',
  base: 'robotics-base',
  // Menu: prototype có Sports (6:36) → 1:7; các mục khác nối theo quyết định 2026-10-08.
  links: navLinks('robotics'),
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
      // Hai cột: trái = GART Expo 2025, phải = GART Expo 2026. Tiêu đề có dấu "•", không gạch chân.
      texts: [
        {
          box: { x: 766, y: 296, w: 422, h: 103 },
          heading: 'GART Expo 2025',
          headingBullet: true,
          text: 'This is where I got my first taste of robotics; although I was only a volunteer and not yet an official member, I was treated like family and experienced the competitive yet close-knit community of robotics engineers.',
        },
        {
          box: { x: 1261, y: 296, w: 422, h: 199 },
          heading: 'GART Expo 2026',
          headingBullet: true,
          text: 'This year, I returned to help organize the event as a member of the Electronic Programming Team, where I contributed ideas and guided visitors through DIY, gaming, and exhibition activities at the largest GART Expo in the club\'s history.',
        },
      ],
      images: [
        { asset: 'gart-1', alt: 'GART Expo 2026', box: { x: 1261, y: 495, w: 386, h: 256 } },
        // Đo lại từ ref 6-117 (2026-10-09): trước đây đặt quá thấp nên giấy chứng nhận lòi khỏi thẻ kính.
        { asset: 'gart-2', alt: 'GART Expo 2025', box: { x: 746, y: 489, w: 365, h: 263 } },
      ],
    },
    {
      id: 'events',
      object: 'events',
      glass: { x: 891, y: 92, w: 1019, h: 895 },
      title: { text: 'Community Events', box: { x: 921, y: 129, w: 429, h: 62 } },
      // Tiêu đề gạch chân, đoạn chữ bắt đầu bằng "•".
      texts: [
        {
          box: { x: 921, y: 212, w: 943, h: 102 },
          heading: 'Robotics for Good Youth Challenge Vietnam 2025-2026, Hanoi Regional Tournament',
          underline: true,
          bullet: true,
          text: 'I was so excited to be a co-organizer and referee for this event that I officiated as many matches as I could. If there had been an award for \'Referee of the Tournament,\' I think I would have won it',
        },
        {
          box: { x: 928, y: 674, w: 448, h: 192 },
          heading: 'STEM day at Tran Duy Hung Secondary School',
          underline: true,
          bullet: true,
          text: 'This is another event I fondly remember, because we got to meet and inspire so many students interested in STEM and robotics. I also got to see a number of impressive student science projects.',
        },
      ],
      images: [
        { asset: 'events-1', alt: 'Robotics for Good 1', box: { x: 928, y: 373, w: 349, h: 198 } },
        { asset: 'events-2', alt: 'Robotics for Good 2', box: { x: 1284, y: 373, w: 287, h: 198 } },
        { asset: 'events-3', alt: 'Robotics for Good 3', box: { x: 1582, y: 373, w: 290, h: 201 } },
        // Đo lại từ ref 6-212 (2026-10-09): trước đây đặt quá thấp nên giấy chứng nhận lòi khỏi thẻ kính.
        { asset: 'events-4', alt: 'STEM day', box: { x: 1444, y: 659, w: 398, h: 285 } },
      ],
    },
    {
      id: 'competitions',
      object: 'competitions',
      glass: { x: 76, y: 83, w: 1019, h: 856 },
      title: { text: 'Competitions', box: { x: 106, y: 118, w: 314, h: 60 } },
      // Tiêu đề không gạch chân, đoạn chữ bắt đầu bằng "•".
      texts: [
        {
          box: { x: 106, y: 198, w: 943, h: 328 },
          heading: 'VEX V5 Robotics Competition Road to Nationals, Northern Qualification Season 25-26',
          bullet: true,
          text: 'Going into our first tournament of the season, we fully expected to be outmatched by most of our opponents. Fortunately, we adapted and teamed up with a strong ally team, which enabled us to clinch the Tournament Champion award.',
        },
        {
          box: { x: 106, y: 556, w: 943, h: 328 },
          heading: '2025-2026 Asia Open Signature Event V5RC High School',
          bullet: true,
          text: 'Although we didn\'t win any major award at our first international tournament, I appreciated the chance to face such strong opponents. They showed us how much harder we needed to work to qualify for the World Championship.',
        },
      ],
      images: [
        { asset: 'competitions-1', alt: 'VEX V5', box: { x: 138, y: 307, w: 362, h: 220 } },
        { asset: 'competitions-2', alt: 'Asia Open 1', box: { x: 138, y: 656, w: 164, h: 230 } },
        { asset: 'competitions-3', alt: 'Asia Open 2', box: { x: 316, y: 656, w: 164, h: 230 } },
      ],
      // Hai trang: chấm đầy (Ellipse 1) = trang đang xem, chấm rỗng (Ellipse 2) = trang kia.
      dots: { assetActive: 'competitions-dot-1', assetInactive: 'competitions-dot-2', box: { x: 138, y: 904, w: 14, h: 14 }, gap: 3 },
      // Trang 2: Figma không có frame — dựng theo mẫu trang 1. Nội dung người dùng gửi 2026-10-09.
      pages: [
        {
          texts: [
            {
              box: { x: 106, y: 198, w: 943, h: 200 },
              heading: 'VEX V5 Robotics Competition High School Vietnam National Championship: Push Back',
              bullet: true,
              text: 'Out of all the tournaments our team has participated in, I felt most proud about what we\'ve accomplished throughout this championship. Sleepless nights at the captain\'s house paid off with 2 of the most prestigious awards in the entire tourney.',
            },
            {
              box: { x: 106, y: 556, w: 943, h: 120 },
              heading: 'Vietnam Signature: New Year’s Mayhem (2026 VEX Robotics World Championship Qualification)',
              bullet: true,
              text: 'Because we qualified for the World Championship through this tourney, I vividly remember how happy we were like it was yesterday.',
            },
          ],
          images: [
            { asset: 'competitions-p2-1', alt: 'National Championship 1', box: { x: 138, y: 307, w: 292, h: 197 } },
            { asset: 'competitions-p2-2', alt: 'National Championship 2', box: { x: 448, y: 307, w: 292, h: 197 } },
            { asset: 'competitions-p2-3', alt: 'National Championship 3', box: { x: 758, y: 307, w: 292, h: 197 } },
            { asset: 'competitions-p2-4', alt: 'New Year’s Mayhem', box: { x: 138, y: 656, w: 325, h: 230 } },
          ],
        },
      ],
    },
  ],
};
