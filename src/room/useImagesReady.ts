import { useEffect, useRef, useState, type RefObject } from 'react';

// Chờ các ảnh đang hiển thị của màn hình (kể cả <image> trong SVG) tải và giải mã xong rồi mới
// cho hiện, để các lớp (nền SVG, sprite, ảnh toàn cảnh) không lần lượt nháy lên.
// Bỏ qua ảnh trong pop-up / thẻ chưa mở: chúng không lộ ra lúc chuyển trang, chờ chúng chỉ làm chậm.
// Có giới hạn thời gian để mạng chậm không làm trang trắng mãi.
const MAX_WAIT_MS = 4000;
const HIDDEN_CONTAINERS = '.popup, .home-panel';

export function useImagesReady(root: RefObject<HTMLElement | null>, onReady?: () => void) {
  const [ready, setReady] = useState(false);
  // Gọi bản onReady mới nhất mà không phải chạy lại việc chờ ảnh.
  const callback = useRef(onReady);
  callback.current = onReady;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
      callback.current?.();
    };

    const imgs = Array.from(el.querySelectorAll('img')).filter((img) => !img.closest(HIDDEN_CONTAINERS));
    // <image> trong SVG không có decode(): tải lại cùng địa chỉ bằng Image để chờ.
    const svgImages = Array.from(el.querySelectorAll('image')).map((node) => {
      const img = new Image();
      img.src = node.getAttribute('href') ?? '';
      return img;
    });
    // Trang bị ẩn (tab nền): trình duyệt hoãn decode() tới khi hiện lại. Lúc đó không ai nhìn,
    // nên chỉ cần ảnh tải xong là đủ, khỏi chờ hết giới hạn thời gian.
    const loaded = (img: HTMLImageElement) =>
      img.complete ? Promise.resolve() : new Promise<void>((res) => {
        img.addEventListener('load', () => res(), { once: true });
        img.addEventListener('error', () => res(), { once: true });
      });
    const all = [...imgs, ...svgImages].map((img) =>
      (document.hidden ? loaded(img) : img.decode()).catch(() => {}));

    Promise.all(all).then(finish);
    const t = setTimeout(finish, MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, [root]);

  return ready;
}
