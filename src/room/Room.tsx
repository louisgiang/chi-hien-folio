import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { STAGE_H, STAGE_W, useStageScale } from '../stage/Stage';
import { boxStyle, CompactPanel, Frame, Glass, Img } from './media';
import type { Box, Popup, RoomConfig, RoomObject } from './types';
import { useFrameCrossfade } from './useFrameCrossfade';
import { hasSportsLift, SportsLift } from './SportsLift';
import './Room.css';

// Cỡ chữ nội dung pop-up trên sân khấu; nếu sau khi co giãn < 12px thì
// chuyển pop-up sang chế độ gần toàn màn hình, cuộn được.
const BODY_FONT = 20;
const MIN_READABLE = 12;
const LEAVE_GRACE_MS = 80;

// Ảnh vượt mép dưới frame: chỉ phần trong frame là nhìn thấy. Figma có thể cắt sẵn khi xuất;
// cắt khung theo mép frame + object-fit: cover (neo trên) để ảnh cắt hay nguyên đều không méo.
const clipToStage = (b: Box): Box => ({ ...b, h: Math.min(b.h, STAGE_H - b.y) });

// Giữ toàn bộ vùng gốc khi mở rộng để animation không đẩy chuột ra/vào ô.
function activeBox(o: RoomObject): Box {
  const x = Math.min(o.base.x, o.hover.x);
  const y = Math.min(o.base.y, o.hover.y);
  return {
    x, y,
    w: Math.max(o.base.x + o.base.w, o.hover.x + o.hover.w) - x,
    h: Math.max(o.base.y + o.base.h, o.hover.y + o.hover.h) - y,
  };
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

  const framesRef = useRef<HTMLDivElement>(null);
  // Sports objects move as separate layers; never fade in their enlarged frames.
  useFrameCrossfade(framesRef, hasSportsLift(room, lit) ? 0 : room.objects.findIndex((o) => o.id === lit) + 1);

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
      <div ref={framesRef} className="room__frames" aria-hidden="true">
        <Frame room={room.id} name={room.base} sizes={sizes} label={`${room.name}: trạng thái gốc`} visible />
        {room.objects.map((o) => (
          <Frame key={o.id} room={room.id} name={o.frame} sizes={sizes} label={`${o.label}: hover`} visible={false} />
        ))}
      </div>

      {room.id === 'sports' && (
        <div className="sports-intro-cover" data-active={lit !== null || undefined} aria-hidden="true">
          <Frame room={room.id} name="sports-hover-goggles" sizes={sizes} label="" visible className="sports-intro-cover__image" />
        </div>
      )}
      <SportsLift room={room} lit={lit} openObject={openPopup?.object ?? null} />

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
            style={boxStyle(isLit ? activeBox(o) : o.base)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && enter(o.id)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && leave(o.id)}
            onFocus={(e) => e.currentTarget.matches(':focus-visible') && setFocused(o.id)}
            onBlur={() => setFocused((f) => (f === o.id ? null : f))}
            onClick={(e) => onObjectClick(o, e)}
          />
        );
      })}

      {/* Liên kết có trong prototype (chữ trên menu đã in sẵn trong ảnh) */}
      {room.links?.map((l) => (
        <a key={l.to + l.label} className="hotspot" href={l.to} aria-label={l.label} style={boxStyle(l.box)}
          onClick={(e) => e.stopPropagation()} />
      ))}

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
            <Glass room={room.id} blur={blur} box={p.glass} sizes={sizes} />
            <h2 id={`${p.id}-title`} className="popup__title" style={boxStyle(p.title.box)}>{p.title.text}</h2>
            {p.texts.map((t, i) => (
              <p key={i} className="popup__body" style={boxStyle(t.box)}>{t.text}</p>
            ))}
            {p.images.map((img) => (
              <Img key={img.asset} room={room.id} asset={img.asset} label={img.alt} className="popup__img" style={boxStyle(clipToStage(img.box))} />
            ))}
            {overlay && !hasSportsLift(room, p.object) && (
              <Img room={room.id} asset={p.overlay!} label="" className="popup__overlay" style={boxStyle(overlay)} />
            )}
          </section>
        );
      })}
    </div>
  );
}

function CompactPopup({ room, popup, panelRef, onClose }: {
  room: string; popup: Popup; panelRef: (el: HTMLElement | null) => void; onClose: () => void;
}) {
  return (
    <CompactPanel labelledBy={`${popup.id}-title-c`} panelRef={panelRef} onClose={onClose}>
      <h2 id={`${popup.id}-title-c`} className="popup__title">{popup.title.text}</h2>
      {popup.texts.map((t, i) => <p key={i} className="popup__body">{t.text}</p>)}
      <div className="popup-compact__imgs">
        {popup.images.map((img) => (
          <Img key={img.asset} room={room} asset={img.asset} label={img.alt} className="popup__img"
            style={{ aspectRatio: `${img.box.w} / ${clipToStage(img.box).h}` }} />
        ))}
      </div>
    </CompactPanel>
  );
}
