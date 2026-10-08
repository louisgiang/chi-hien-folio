import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import './Stage.css';

export const STAGE_W = 1920;
export const STAGE_H = 1080;

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
export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(fit);

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
