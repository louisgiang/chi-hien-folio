// Tọa độ theo khung 1920×1080 của Figma.
export type Box = { x: number; y: number; w: number; h: number };

export type RoomObject = {
  id: string;
  label: string;
  /** Ảnh full-frame của trạng thái hover (src/assets/<room>/<frame>.webp, kèm bản -sm / -2x). */
  frame: string;
  /** Ô trong suốt nhận hover/click: khung layer ở frame gốc. */
  base: Box;
  /** Khung hover: vùng nhận chuột mở rộng bao gồm cả khung gốc và khung này. */
  hover: Box;
  popup: string;
};

export type PopupImage = { asset: string; box: Box; alt: string };
export type PopupText = {
  /** Đoạn nội dung (một đoạn, giữ \n đúng như Figma). */
  text: string;
  box: Box;
  /** Dòng tiêu đề phía trên đoạn chữ (các pop-up Robotics). */
  heading?: string;
  /** Gạch chân dòng tiêu đề (Community Events). */
  underline?: boolean;
  /** Dấu "•" ngay trước dòng tiêu đề (GART). */
  headingBullet?: boolean;
  /** Dấu "•" treo lề ở đầu đoạn chữ (Community Events, Competitions). */
  bullet?: boolean;
};

/** Một trang nội dung trong pop-up nhiều trang (Competitions). */
export type PopupPage = { texts: PopupText[]; images: PopupImage[] };

/** Phân trang bằng hai chấm như Figma: chấm đầy cho trang đang xem, chấm rỗng cho trang kia. */
export type PopupDots = { assetActive: string; assetInactive: string; box: Box; gap?: number };

export type Popup = {
  id: string;
  /** Đồ vật được làm sáng khi pop-up mở: nền phía sau là ảnh hover của nó. */
  object: string;
  glass: Box;
  /** Xuống dòng bằng \n đúng như Figma (tiêu đề không tự ngắt dòng). */
  title: PopupText;
  /** Đoạn chữ của trang 1 (hoặc trang duy nhất). */
  texts: PopupText[];
  images: PopupImage[];
  /** Các trang bổ sung (trang 2 trở đi). Có mặt thì hiện chấm phân trang. */
  pages?: PopupPage[];
  /** Cấu hình hai chấm phân trang (bắt buộc khi có `pages`). */
  dots?: PopupDots;
  /** Layer đồ vật nằm trên thẻ kính; vị trí lấy từ overlays.json. */
  overlay?: string;
};

/** Liên kết có sẵn trong prototype (ví dụ chữ trên menu), dạng ô trong suốt. */
export type RoomLink = { label: string; box: Box; to: string };

export type RoomConfig = {
  id: string;
  name: string;
  /** Ảnh full-frame của trạng thái gốc (đã có menu và khung giới thiệu). */
  base: string;
  objects: RoomObject[];
  popups: Popup[];
  links?: RoomLink[];
  overlays?: Record<string, Box>;
};
