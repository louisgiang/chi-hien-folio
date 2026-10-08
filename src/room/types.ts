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
export type PopupText = { text: string; box: Box };

export type Popup = {
  id: string;
  /** Đồ vật được làm sáng khi pop-up mở: nền phía sau là ảnh hover của nó. */
  object: string;
  glass: Box;
  /** Xuống dòng bằng \n đúng như Figma (tiêu đề không tự ngắt dòng). */
  title: PopupText;
  /** Một hoặc nhiều đoạn chữ, mỗi đoạn một khung như trong Figma. */
  texts: PopupText[];
  images: PopupImage[];
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
