import type { CSSProperties, ReactNode } from 'react';
import type { Box } from './types';

// Ảnh chuyển từ figma-export/ bằng scripts/convert-export.mjs. Thiếu file thì hiện khung giữ chỗ.
const ASSETS = import.meta.glob<string>('../assets/**/*.webp', { eager: true, import: 'default' });
export const assetUrl = (room: string, name: string) => ASSETS[`../assets/${room}/${name}.webp`];

export const boxStyle = (b: Box): CSSProperties => ({ left: b.x, top: b.y, width: b.w, height: b.h });

/** Ảnh full-frame 1920×1080, kèm bản -sm (960) và -2x (3840) nếu có. */
export function Frame({ room, name, sizes, label, visible, held, className = 'frame', style }: {
  room: string; name: string; sizes: string; label: string; visible: boolean; held?: boolean;
  className?: string; style?: CSSProperties;
}) {
  const src = assetUrl(room, name);
  const sm = assetUrl(room, `${name}-sm`);
  const x2 = assetUrl(room, `${name}-2x`);
  if (!src) {
    return <span className={`${className} placeholder`} data-visible={visible || undefined}>{label}<small>{name}.webp</small></span>;
  }
  const srcSet = [sm && `${sm} 960w`, `${src} 1920w`, x2 && `${x2} 3840w`].filter(Boolean).join(', ');
  return (
    <img
      className={className}
      style={style}
      data-visible={visible || undefined}
      data-held={held || undefined}
      src={src}
      srcSet={sm || x2 ? srcSet : undefined}
      sizes={sm || x2 ? sizes : undefined}
      alt=""
      draggable={false}
      decoding="async"
    />
  );
}

export function Img({ room, asset, label, className, style }: {
  room: string; asset: string; label: string; className?: string; style?: CSSProperties;
}) {
  const src = assetUrl(room, asset);
  if (!src) {
    return <span className={`placeholder ${className ?? ''}`} style={style}>{label}<small>{asset}.webp</small></span>;
  }
  return <img src={src} alt={label} className={className} style={style} draggable={false} decoding="async" />;
}

/**
 * Pop-up thu gọn cho màn hình nhỏ: gần toàn màn hình, cuộn được, chữ theo px thật.
 * Render qua portal ra ngoài sân khấu (không bị co giãn).
 */
export function CompactPanel({ labelledBy, panelRef, onClose, children }: {
  labelledBy: string; panelRef: (el: HTMLElement | null) => void; onClose: () => void; children: ReactNode;
}) {
  return (
    <div className="popup-compact" onClick={onClose}>
      <section
        ref={panelRef}
        className="popup-compact__panel glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="popup-compact__close" aria-label="Đóng" onClick={onClose}>×</button>
        {children}
      </section>
    </div>
  );
}

/**
 * Thẻ kính: nền mờ dựng sẵn (<blur>.webp, cắt đúng khung thẻ) thay cho backdrop-filter.
 * Thiếu ảnh mờ thì quay về backdrop-filter.
 */
export function Glass({ room, blur, box, sizes, className, children }: {
  room: string; blur: string; box: Box; sizes: string; className?: string; children?: ReactNode;
}) {
  const hasBlur = !!assetUrl(room, blur);
  return (
    <div className={`glass ${className ?? ''}`} data-live={!hasBlur || undefined} style={boxStyle(box)}>
      {hasBlur && (
        <Frame room={room} name={blur} sizes={sizes} label="" visible className="glass__bg"
          style={{ left: `calc(${-box.x}px - var(--glass-border))`, top: `calc(${-box.y}px - var(--glass-border))` }} />
      )}
      {children}
    </div>
  );
}
