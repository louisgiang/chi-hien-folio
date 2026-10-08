// Tọa độ theo khung 1920×1080 của Figma.
export type Box = { x: number; y: number; w: number; h: number };

export type RoomObject = {
  id: string;
  label: string;
  /** Ảnh full-frame của trạng thái hover (src/assets/<room>/<frame>.webp, kèm bản -sm). */
  frame: string;
  /** Ô trong suốt nhận hover/click: khung layer ở frame gốc. */
  base: Box;
  /** Khung layer ở frame hover: ô phóng theo khi đang hover, như vùng hover của Figma. */
  hover: Box;
  popup: string;
};

export type PopupImage = { asset: string; box: Box; alt: string };

export type Popup = {
  id: string;
  /** Đồ vật được làm sáng khi pop-up mở: nền phía sau là ảnh hover của nó. */
  object: string;
  glass: Box;
  title: { text: string; box: Box };
  body: { text: string; box: Box };
  images: PopupImage[];
  /** Layer đồ vật nằm trên thẻ kính; vị trí lấy từ overlays.json. */
  overlay?: string;
};

export type RoomConfig = {
  id: string;
  name: string;
  /** Ảnh full-frame của trạng thái gốc (đã có menu và khung giới thiệu). */
  base: string;
  objects: RoomObject[];
  popups: Popup[];
  overlays?: Record<string, Box>;
};
