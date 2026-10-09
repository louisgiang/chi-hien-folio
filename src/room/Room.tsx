import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { STAGE_H, STAGE_W, useStageScale } from '../stage/Stage';
import { boxStyle, CompactPanel, Frame, Glass, Img } from './media';
import type { Box, Popup, PopupDots, PopupPage, PopupText, RoomConfig, RoomObject } from './types';
import { useFrameCrossfade } from './useFrameCrossfade';
import { useImagesReady } from './useImagesReady';
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

const BULLET = '• ';
const SWIPE_MIN = 40;

// Pop-up nhiều trang: trang 1 là texts/images của pop-up, các trang sau là p.pages.
const popupPages = (p: Popup): PopupPage[] =>
  p.pages ? [{ texts: p.texts, images: p.images }, ...p.pages] : [{ texts: p.texts, images: p.images }];

// Hai chấm phân trang như Figma: chấm đầy = trang đang xem. Có thể bấm để lật trang.
function Dots({ room, dots, count, page, onPage, positioned }: {
  room: string; dots: PopupDots; count: number; page: number; onPage: (i: number) => void; positioned: boolean;
}) {
  const style: CSSProperties = positioned
    ? { left: dots.box.x, top: dots.box.y, gap: dots.gap ?? 4 }
    : { position: 'static', justifyContent: 'center', gap: Math.max(dots.gap ?? 4, 10), marginTop: 12 };
  const size: CSSProperties = positioned ? { width: dots.box.w, height: dots.box.h } : { width: 16, height: 16 };
  return (
    <div className="popup__dots" style={style}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} type="button" className="popup__dot" style={size} aria-current={i === page}
          aria-label={`Trang ${i + 1} / ${count}`} onClick={(e) => { e.stopPropagation(); onPage(i); }}>
          <Img room={room} asset={i === page ? dots.assetActive : dots.assetInactive} label="" className="popup__dot-img" />
        </button>
      ))}
    </div>
  );
}

// Đoạn chữ pop-up. Mặc định (Sports): một <p> đúng như trước.
// Khi có tiêu đề/gạch chân/đầu dòng (Robotics): tiêu đề một dòng + đoạn chữ,
// đầu dòng "•" treo lề như trong Figma.
function PopupTextBlock({ t, style }: { t: PopupText; style?: CSSProperties }) {
  if (t.heading === undefined && !t.bullet) {
    return <p className="popup__body" style={style}>{t.text}</p>;
  }
  return (
    <div className="popup__body" style={style}>
      {t.heading !== undefined && (
        <div className={t.underline ? 'popup__u' : undefined}>{t.headingBullet ? BULLET : ''}{t.heading}</div>
      )}
      <div className={t.bullet ? 'popup__bullet' : undefined}>{t.bullet ? BULLET : ''}{t.text}</div>
    </div>
  );
}

export function Room({ room }: { room: RoomConfig }) {
  const scale = useStageScale();
  const compact = BODY_FONT * scale < MIN_READABLE;

  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  // Trang hiện tại của pop-up nhiều trang (Competitions). Về 0 mỗi lần mở pop-up.
  const [page, setPage] = useState(0);
  useEffect(() => { setPage(0); }, [open]);
  const pointerType = useRef('mouse');
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const panels = useRef(new Map<string, HTMLElement>());

  const openPopup = room.popups.find((p) => p.id === open) ?? null;

  // Vuốt ngang (chạm) để lật trang pop-up nhiều trang.
  const swipeStartX = useRef<number | null>(null);
  const swipeHandlers = (count: number) => ({
    onPointerDown: (e: ReactPointerEvent) => { if (e.pointerType === 'touch') swipeStartX.current = e.clientX; },
    onPointerUp: (e: ReactPointerEvent) => {
      if (swipeStartX.current === null) return;
      const dx = e.clientX - swipeStartX.current;
      swipeStartX.current = null;
      if (Math.abs(dx) < SWIPE_MIN) return;
      setPage((pg) => { const n = dx < 0 ? pg + 1 : pg - 1; return n >= 0 && n < count ? n : pg; });
    },
  });

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

  // Giải mã sẵn mọi ảnh rồi mới hiện phòng (mờ dần một lần): tránh nháy khi mở trang
  // và lần hover đầu tiên không bị khựng.
  const roomRef = useRef<HTMLDivElement>(null);
  const ready = useImagesReady(roomRef);
  // Ảnh frame thường hiển thị ở khoảng 1920 × scale px; trình duyệt tự tính thêm mật độ điểm ảnh.
  const sizes = `${Math.ceil(STAGE_W * scale)}px`;

  return (
    <div
      ref={roomRef}
      className="room"
      data-ready={ready || undefined}
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
        const pages = popupPages(p);
        const pg = Math.min(page, pages.length - 1);
        const content = pages[pg];
        const multi = pages.length > 1;
        if (compact) {
          return isOpen
            ? createPortal(
                <CompactPopup key={p.id} room={room.id} popup={p} content={content} page={pg} count={pages.length}
                  onPage={setPage} swipe={multi ? swipeHandlers(pages.length) : undefined}
                  panelRef={panelRef} onClose={() => close()} />,
                document.body)
            : null;
        }
        const overlay = p.overlay && room.overlays?.[p.overlay];
        const blur = `${room.objects.find((o) => o.id === p.object)!.frame}-blur`;
        return (
          <section
            key={p.id}
            ref={panelRef}
            className={p.dark ? 'popup popup--dark' : 'popup'}
            data-open={isOpen || undefined}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isOpen}
            aria-labelledby={`${p.id}-title`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            {...(multi ? swipeHandlers(pages.length) : {})}
          >
            <Glass room={room.id} blur={blur} box={p.glass} sizes={sizes} />
            <h2 id={`${p.id}-title`} className="popup__title" style={boxStyle(p.title.box)}>{p.title.text}</h2>
            {content.texts.map((t, i) => (
              <PopupTextBlock key={i} t={t} style={boxStyle(t.box)} />
            ))}
            {content.images.map((img) => (
              <Img key={img.asset} room={room.id} asset={img.asset} label={img.alt} className="popup__img" style={boxStyle(clipToStage(img.box))} />
            ))}
            {multi && p.dots && (
              <Dots room={room.id} dots={p.dots} count={pages.length} page={pg} onPage={setPage} positioned />
            )}
            {overlay && !hasSportsLift(room, p.object) && (
              <Img room={room.id} asset={p.overlay!} label="" className="popup__overlay" style={boxStyle(overlay)} />
            )}
          </section>
        );
      })}
    </div>
  );
}

function CompactPopup({ room, popup, content, page, count, onPage, swipe, panelRef, onClose }: {
  room: string; popup: Popup; content: PopupPage; page: number; count: number;
  onPage: (i: number) => void;
  swipe?: { onPointerDown: (e: ReactPointerEvent) => void; onPointerUp: (e: ReactPointerEvent) => void };
  panelRef: (el: HTMLElement | null) => void; onClose: () => void;
}) {
  return (
    <CompactPanel labelledBy={`${popup.id}-title-c`} panelRef={panelRef} onClose={onClose}>
      <div {...(swipe ?? {})}>
        <h2 id={`${popup.id}-title-c`} className="popup__title">{popup.title.text}</h2>
        {content.texts.map((t, i) => <PopupTextBlock key={i} t={t} />)}
        <div className="popup-compact__imgs">
          {content.images.map((img) => (
            <Img key={img.asset} room={room} asset={img.asset} label={img.alt} className="popup__img"
              style={{ aspectRatio: `${img.box.w} / ${clipToStage(img.box).h}` }} />
          ))}
        </div>
        {count > 1 && popup.dots && (
          <Dots room={room} dots={popup.dots} count={count} page={page} onPage={onPage} positioned={false} />
        )}
      </div>
    </CompactPanel>
  );
}
