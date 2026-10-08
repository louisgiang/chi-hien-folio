import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { STAGE_W, useStageScale } from '../stage/Stage';
import type { Box, Popup, RoomConfig, RoomObject } from './types';
import './Room.css';

// Ảnh chuyển từ figma-export/ bằng scripts/convert-export.mjs. Thiếu file thì hiện khung giữ chỗ.
const ASSETS = import.meta.glob<string>('../assets/**/*.webp', { eager: true, import: 'default' });
const assetUrl = (room: string, name: string) => ASSETS[`../assets/${room}/${name}.webp`];

// Cỡ chữ nội dung pop-up trên sân khấu; nếu sau khi co giãn < 12px thì
// chuyển pop-up sang chế độ gần toàn màn hình, cuộn được.
const BODY_FONT = 20;
const MIN_READABLE = 12;
// Khớp với --dur trong styles.css.
const CROSSFADE_MS = 300;
const LEAVE_GRACE_MS = 80;

const boxStyle = (b: Box): CSSProperties => ({ left: b.x, top: b.y, width: b.w, height: b.h });

// Ô trong suốt phóng theo khung layer của frame hover.
function hoverTransform(o: RoomObject) {
  const sx = o.hover.w / o.base.w;
  const sy = o.hover.h / o.base.h;
  return `translate(${o.hover.x - o.base.x}px, ${o.hover.y - o.base.y}px) scale(${sx}, ${sy})`;
}

export function Room({ room }: { room: RoomConfig }) {
  const scale = useStageScale();
  const compact = BODY_FONT * scale < MIN_READABLE;

  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const pointerType = useRef('mouse');
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const panels = useRef(new Map<string, HTMLElement>());

  const openPopup = room.popups.find((p) => p.id === open) ?? null;

  const close = useCallback((byKeyboard = false) => {
    const owner = openPopup?.object;
    const panel = openPopup && panels.current.get(openPopup.id);
    setOpen(null);
    // Chuột vẫn đang nằm trên đồ vật thì giữ trạng thái hover (while hovering).
    if (pointerType.current !== 'mouse') setHovered(null);
    if (!panel?.contains(document.activeElement)) return;
    // Đóng bằng Esc: trả focus về đồ vật. Đóng bằng click/chạm: bỏ focus.
    if (byKeyboard && owner) buttons.current.get(owner)?.focus();
    else (document.activeElement as HTMLElement).blur();
  }, [openPopup]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (open) panels.current.get(open)?.focus({ preventScroll: true });
  }, [open, compact]);

  // Rời đồ vật: chờ một chút mới bỏ hover. Nếu chuột vào đồ vật khác ngay (khe giữa hai
  // đồ vật) thì chuyển thẳng A → B, không lộ ảnh gốc ở giữa.
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = (id: string) => {
    clearTimeout(leaveTimer.current);
    setHovered(id);
  };
  const leave = (id: string) => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHovered((h) => (h === id ? null : h)), LEAVE_GRACE_MS);
  };
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const onObjectClick = (o: RoomObject, e: MouseEvent) => {
    e.stopPropagation();
    // e.detail === 0: click sinh ra từ bàn phím (Enter/Space).
    const touch = e.detail !== 0 && pointerType.current !== 'mouse';
    if (touch && hovered !== o.id) {
      // Chạm lần 1 = trạng thái hover; chạm lần 2 vào cùng đồ vật = mở pop-up.
      setHovered(o.id);
      return;
    }
    setOpen(o.popup);
  };

  // Click / chạm ra ngoài: đóng pop-up và về trạng thái gốc.
  const onBackgroundClick = () => {
    if (open) close();
    else if (pointerType.current !== 'mouse') setHovered(null);
  };

  // Đồ vật đang sáng: pop-up đang mở ưu tiên, rồi tới hover/focus.
  const lit = openPopup?.object ?? hovered ?? focused;

  // Chuyển thẳng từ hover đồ vật A sang B: giữ ảnh A bên dưới tới khi ảnh B hiện xong,
  // để ảnh gốc không lộ ra giữa chừng (không bị chớp).
  const [held, setHeld] = useState<string | null>(null);
  const prevLit = useRef(lit);
  useEffect(() => {
    const prev = prevLit.current;
    prevLit.current = lit;
    if (!prev || !lit || prev === lit) {
      setHeld(null);
      return;
    }
    setHeld(prev);
    const t = setTimeout(() => setHeld(null), CROSSFADE_MS);
    return () => clearTimeout(t);
  }, [lit]);

  // Giải mã sẵn mọi ảnh khi vào phòng, để lần hover đầu tiên không bị khựng.
  const roomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    roomRef.current?.querySelectorAll('img').forEach((img) => void img.decode().catch(() => {}));
  }, []);
  // Ảnh frame thường hiển thị ở khoảng 1920 × scale px; trình duyệt tự tính thêm mật độ điểm ảnh.
  const sizes = `${Math.ceil(STAGE_W * scale)}px`;

  return (
    <div
      ref={roomRef}
      className="room"
      onPointerDownCapture={(e) => (pointerType.current = e.pointerType)}
      onClick={onBackgroundClick}
    >
      <Frame room={room.id} name={room.base} sizes={sizes} label={`${room.name}: trạng thái gốc`} visible />
      {room.objects.map((o) => (
        <Frame key={o.id} room={room.id} name={o.frame} sizes={sizes} label={`${o.label}: hover`}
          visible={lit === o.id} held={held === o.id} />
      ))}

      {room.objects.map((o) => {
        const isLit = lit === o.id || hovered === o.id;
        return (
          <button
            key={o.id}
            ref={(el) => void (el ? buttons.current.set(o.id, el) : buttons.current.delete(o.id))}
            type="button"
            className="hotspot"
            aria-label={o.label}
            aria-haspopup="dialog"
            aria-expanded={open === o.popup}
            style={{ ...boxStyle(o.base), transform: isLit ? hoverTransform(o) : undefined }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && enter(o.id)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && leave(o.id)}
            onFocus={(e) => e.currentTarget.matches(':focus-visible') && setFocused(o.id)}
            onBlur={() => setFocused((f) => (f === o.id ? null : f))}
            onClick={(e) => onObjectClick(o, e)}
          />
        );
      })}

      {room.popups.map((p) => {
        const isOpen = open === p.id;
        const panelRef = (el: HTMLElement | null) => void (el ? panels.current.set(p.id, el) : panels.current.delete(p.id));
        if (compact) {
          return isOpen
            ? createPortal(<CompactPopup key={p.id} room={room.id} popup={p} panelRef={panelRef} onClose={() => close()} />, document.body)
            : null;
        }
        const overlay = p.overlay && room.overlays?.[p.overlay];
        const blur = `${room.objects.find((o) => o.id === p.object)!.frame}-blur`;
        const hasBlur = !!assetUrl(room.id, blur);
        return (
          <section
            key={p.id}
            ref={panelRef}
            className="popup"
            data-open={isOpen || undefined}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isOpen}
            aria-labelledby={`${p.id}-title`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nền mờ dựng sẵn, cắt đúng khung thẻ; thiếu ảnh thì quay về backdrop-filter */}
            <div className="glass" data-live={!hasBlur || undefined} style={boxStyle(p.glass)}>
              {hasBlur && (
                <Frame room={room.id} name={blur} sizes={sizes} label="" visible className="glass__bg"
                  style={{ left: `calc(${-p.glass.x}px - var(--glass-border))`, top: `calc(${-p.glass.y}px - var(--glass-border))` }} />
              )}
            </div>
            <h2 id={`${p.id}-title`} className="popup__title" style={boxStyle(p.title.box)}>{p.title.text}</h2>
            <p className="popup__body" style={boxStyle(p.body.box)}>{p.body.text}</p>
            {p.images.map((img) => (
              <Img key={img.asset} room={room.id} asset={img.asset} label={img.alt} className="popup__img" style={boxStyle(img.box)} />
            ))}
            {overlay && (
              <Img room={room.id} asset={p.overlay!} label="" className="popup__overlay" style={boxStyle(overlay)} />
            )}
          </section>
        );
      })}
    </div>
  );
}

function Frame({ room, name, sizes, label, visible, held, className = 'frame', style }: {
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

function CompactPopup({ room, popup, panelRef, onClose }: {
  room: string; popup: Popup; panelRef: (el: HTMLElement | null) => void; onClose: () => void;
}) {
  return (
    <div className="popup-compact" onClick={onClose}>
      <section
        ref={panelRef}
        className="popup-compact__panel glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${popup.id}-title-c`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="popup-compact__close" aria-label="Đóng" onClick={onClose}>×</button>
        <h2 id={`${popup.id}-title-c`} className="popup__title">{popup.title.text}</h2>
        <p className="popup__body">{popup.body.text}</p>
        <div className="popup-compact__imgs">
          {popup.images.map((img) => (
            <Img key={img.asset} room={room} asset={img.asset} label={img.alt} className="popup__img"
              style={{ aspectRatio: `${img.box.w} / ${img.box.h}` }} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Img({ room, asset, label, className, style }: {
  room: string; asset: string; label: string; className?: string; style?: CSSProperties;
}) {
  const src = assetUrl(room, asset);
  if (!src) {
    return <span className={`placeholder ${className ?? ''}`} style={style}>{label}<small>{asset}.webp</small></span>;
  }
  return <img src={src} alt={label} className={className} style={style} draggable={false} decoding="async" />;
}
