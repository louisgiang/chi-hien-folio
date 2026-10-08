import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { STAGE_W, useStageScale } from '../stage/Stage';
import { boxStyle, CompactPanel, Frame, Glass, Img } from '../room/media';
import { useImagesReady } from '../room/useImagesReady';
import { home, type HomePanelId } from './homeConfig';
import '../room/Room.css';
import './Home.css';

// Giống phòng: chữ 20px co dưới 12px thì thẻ chuyển sang dạng gần toàn màn hình.
const BODY_FONT = 20;
const MIN_READABLE = 12;
const HOME = '#/';

// Thẻ đang mở nằm trên đường dẫn (#/about, #/howto, #/select) để menu trong các phòng mở thẳng được.
// Click ra ngoài thẻ hoặc Esc: về #/ (đóng thẻ).
export function Home({ panel }: { panel: HomePanelId | null }) {
  const scale = useStageScale();
  const compact = BODY_FONT * scale < MIN_READABLE;
  const sizes = `${Math.ceil(STAGE_W * scale)}px`;
  const panels = useRef(new Map<string, HTMLElement>());
  // Như phòng: chờ ảnh giải mã xong mới hiện, tránh nháy khi mở trang.
  const rootRef = useRef<HTMLDivElement>(null);
  const ready = useImagesReady(rootRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panel) location.hash = HOME;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  useEffect(() => {
    if (panel) panels.current.get(panel)?.focus({ preventScroll: true });
  }, [panel, compact]);

  const close = () => {
    if (panel) location.hash = HOME;
  };

  // Dựng một thẻ: trên sân khấu theo tọa độ Figma, hoặc thu gọn trên màn hình nhỏ.
  const renderPanel = (id: HomePanelId, glass: typeof home.about.glass, title: string, onStage: ReactNode, compactBody: ReactNode) => {
    const isOpen = panel === id;
    const ref = (el: HTMLElement | null) => void (el ? panels.current.set(id, el) : panels.current.delete(id));
    if (compact) {
      return isOpen
        ? createPortal(
            <CompactPanel key={id} labelledBy={`home-${id}-c`} panelRef={ref} onClose={close}>
              <h2 id={`home-${id}-c`} className="popup__title">{title}</h2>
              {compactBody}
            </CompactPanel>,
            document.body,
          )
        : null;
    }
    return (
      <section key={id} ref={ref} className="popup home-panel" data-open={isOpen || undefined} role="dialog"
        aria-modal="true" aria-hidden={!isOpen} aria-label={title} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <Glass room={home.id} blur={home.blur} box={glass} sizes={sizes} className="home-panel__glass" />
        {onStage}
      </section>
    );
  };

  const { about, howto, select } = home;
  return (
    <div ref={rootRef} className="room" data-ready={ready || undefined} onClick={close}>
      <Frame room={home.id} name={home.base} sizes={sizes} label="Trang chủ" visible />

      {home.menu.map((m) => (
        <a key={m.panel} className="hotspot" href={`#/${m.panel}`} aria-label={m.label}
          aria-current={panel === m.panel ? 'page' : undefined} style={boxStyle(m.box)} onClick={(e) => e.stopPropagation()} />
      ))}

      {renderPanel('about', about.glass, 'About Me',
        <>
          <Img room={home.id} asset={about.photo.asset} label={about.photo.alt} className="home-panel__photo" style={boxStyle(about.photo.box)} />
          <p className="popup__body" style={boxStyle(about.text.box)}>{about.text.text}</p>
        </>,
        <>
          <Img room={home.id} asset={about.photo.asset} label={about.photo.alt} className="home-panel__photo-c"
            style={{ aspectRatio: `${about.photo.box.w} / ${about.photo.box.h}` }} />
          <p className="popup__body">{about.text.text}</p>
        </>,
      )}

      {renderPanel('howto', howto.glass, howto.title.text,
        <>
          <h2 className="popup__title home-panel__title" style={boxStyle(howto.title.box)}>{howto.title.text}</h2>
          <p className="popup__body" style={boxStyle(howto.text.box)}>{howto.text.text}</p>
        </>,
        <p className="popup__body">{howto.text.text}</p>,
      )}

      {renderPanel('select', select.glass, 'Select the Memory',
        <nav aria-label="Chọn ký ức">
          {select.options.map((o) => (
            <a key={o.to} className="home-option" href={o.to} style={boxStyle(o.box)}>{o.text}</a>
          ))}
        </nav>,
        <nav className="home-options-c" aria-label="Chọn ký ức">
          {select.options.map((o) => <a key={o.to} className="home-option" href={o.to}>{o.text}</a>)}
        </nav>,
      )}
    </div>
  );
}
