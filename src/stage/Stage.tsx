import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import './Stage.css';

export const STAGE_W = 1920;
export const STAGE_H = 1080;
// Khớp với --dur trong styles.css.
const BACKDROP_FADE_MS = 300;

const ScaleContext = createContext(1);
export const useStageScale = () => useContext(ScaleContext);

function fit() {
  const vv = window.visualViewport;
  const w = vv?.width ?? window.innerWidth;
  const h = vv?.height ?? window.innerHeight;
  return Math.min(w / STAGE_W, h / STAGE_H);
}

// Sân khấu 1920×1080 cố định, co giãn cả khối theo tỉ lệ như màn hình game.
// Phần thừa hai bên/trên dưới là nền tối (letterbox).
// backdrop: ảnh gốc của màn hình hiện tại, phóng kín khung, làm mờ và tối để lấp phần thừa.
export function Stage({ children, backdrop }: { children: ReactNode; backdrop?: string }) {
  const [scale, setScale] = useState(fit);
  // Nền cũ nằm dưới cho tới khi nền mới tải xong và mờ dần lên (không tắt rồi bật lại).
  const [backdrops, setBackdrops] = useState<string[]>(backdrop ? [backdrop] : []);
  useEffect(() => {
    if (backdrop) setBackdrops((list) => (list.at(-1) === backdrop ? list : [...list.filter((b) => b !== backdrop), backdrop]));
  }, [backdrop]);
  const onBackdropLoad = (src: string, img: HTMLImageElement) => {
    img.dataset.loaded = '';
    // Sau khi nền mới hiện xong thì bỏ các nền cũ bên dưới.
    setTimeout(() => setBackdrops((list) => (list.at(-1) === src ? [src] : list)), BACKDROP_FADE_MS);
  };

  useEffect(() => {
    const update = () => setScale(fit());
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return (
    <ScaleContext.Provider value={scale}>
      <div className="viewport">
        {backdrops.map((src) => (
          <img key={src} className="backdrop" src={src} alt="" aria-hidden="true" draggable={false}
            onLoad={(e) => onBackdropLoad(src, e.currentTarget)} />
        ))}
        <div
          className="stage"
          style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </ScaleContext.Provider>
  );
}
