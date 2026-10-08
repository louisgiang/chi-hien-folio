import { useEffect, useState, type RefObject } from 'react';

// Chờ mọi ảnh trong màn hình (kể cả <image> trong SVG) tải và giải mã xong rồi mới cho hiện,
// để các lớp (nền SVG, sprite, ảnh toàn cảnh) không lần lượt nháy lên khi mở trang.
// Có giới hạn thời gian để mạng chậm không làm trang trắng mãi.
const MAX_WAIT_MS = 4000;

export function useImagesReady(root: RefObject<HTMLElement | null>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };

    const imgs = Array.from(el.querySelectorAll('img'));
    // <image> trong SVG không có decode(): tải lại cùng địa chỉ bằng Image để chờ.
    const svgImages = Array.from(el.querySelectorAll('image')).map((node) => {
      const img = new Image();
      img.src = node.getAttribute('href') ?? '';
      return img;
    });
    const all = [...imgs, ...svgImages].map((img) => img.decode().catch(() => {}));

    Promise.all(all).then(finish);
    const t = setTimeout(finish, MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, [root]);

  return ready;
}
