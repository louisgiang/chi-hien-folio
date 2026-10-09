import { useEffect, useRef, useState } from 'react';
import { Stage } from './stage/Stage';
import { PortraitHint } from './stage/PortraitHint';
import { Room } from './room/Room';
import { Home } from './home/Home';
import { home, type HomePanelId } from './home/homeConfig';
import { assetUrl } from './room/media';
import { sports } from './rooms/sports';
import { robotics } from './rooms/robotics';
import { community } from './rooms/community';
import { iar } from './rooms/iar';
import type { RoomConfig } from './room/types';

// Định tuyến bằng hash để build tĩnh chạy được ở mọi host.
//   #/                      trang chủ
//   #/about #/howto #/select  trang chủ, mở sẵn thẻ tương ứng
//   #/sports #/robotics #/community #/iar  các phòng
const ROOMS: Record<string, RoomConfig> = { sports, robotics, community, iar };
const HOME_PANELS: HomePanelId[] = ['about', 'howto', 'select'];
// Khớp với --dur trong styles.css (Smart Animate 300ms giữa hai màn hình).
const PAGE_FADE_MS = 300;

type Route = { page: string; panel: HomePanelId | null };

// Ảnh gốc (full-frame) của từng màn hình.
const baseOf = (page: string) => (page === 'home' ? home.base : ROOMS[page].base);
// Màn hình chỉ hiện cho người xem khi đã có ảnh gốc; chưa có thì chuyển về phòng dự phòng,
// để bản triển khai không bao giờ hiện khung giữ chỗ. Xuất ảnh xong là màn hình tự bật.
const isReady = (page: string) => !!assetUrl(page, baseOf(page));
const FALLBACK = 'sports';

const readRoute = (): Route => {
  const id = location.hash.replace(/^#\/?/, '');
  const want: Route = id in ROOMS
    ? { page: id, panel: null }
    : { page: 'home', panel: HOME_PANELS.includes(id as HomePanelId) ? (id as HomePanelId) : null };
  if (isReady(want.page)) return want;
  // Đồng bộ thanh địa chỉ với màn hình đang hiện (không thêm mục vào lịch sử).
  history.replaceState(null, '', `#/${FALLBACK}`);
  return { page: FALLBACK, panel: null };
};

// Nền mờ lấp phần thừa hai bên (hoặc trên dưới) khi khung trình duyệt không đúng 16:9.
const backdropOf = (page: string) => assetUrl(page, `${baseOf(page)}-sm`) ?? assetUrl(page, baseOf(page));

function Page({ page, panel, onReady }: Route & { onReady?: () => void }) {
  return page === 'home' ? <Home panel={panel} onReady={onReady} /> : <Room room={ROOMS[page]} onReady={onReady} />;
}

// Ảnh toàn cảnh của một màn hình (gốc, hover, nền mờ của thẻ kính) để tải trước.
const pageImages = (page: string) => {
  const names = page === 'home'
    ? [home.base, home.blur]
    : [ROOMS[page].base, ...ROOMS[page].objects.flatMap((o) => [o.frame, `${o.frame}-blur`])];
  return names.map((n) => ({ page, name: n }));
};

// Tải trước ảnh các màn hình khác khi trình duyệt rảnh, đúng cỡ mà srcset sẽ chọn,
// để lần đầu chuyển trang trên mạng thật không phải chờ tải ảnh.
function prefetchOtherPages(current: string) {
  const want = 1920 * (window.innerWidth / 1920) * (window.devicePixelRatio || 1);
  const variant = want <= 960 ? '-sm' : want <= 1920 ? '' : '-2x';
  const pages = ['home', ...Object.keys(ROOMS)].filter((p) => p !== current && isReady(p));
  const urls = pages.flatMap(pageImages)
    .map(({ page, name }) => assetUrl(page, `${name}${variant}`) ?? assetUrl(page, name))
    .filter((u): u is string => !!u);
  const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb) : setTimeout(cb, 200));
  // Tải lần lượt từng ảnh để không giành băng thông với màn hình đang xem.
  const next = (i: number) => {
    if (i >= urls.length) return;
    const img = new Image();
    img.src = urls[i];
    img.decode().catch(() => {}).finally(() => idle(() => next(i + 1)));
  };
  idle(() => next(0));
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  // Màn hình cũ nằm nguyên bên dưới cho tới khi màn hình mới đã sẵn sàng VÀ mờ dần xong,
  // để không bao giờ lộ khoảng tối giữa hai màn hình (ảnh trên mạng có thể tải lâu hơn 300ms).
  const [leaving, setLeaving] = useState<string | null>(null);
  const [readyPage, setReadyPage] = useState<string | null>(null);
  const current = useRef(route.page);
  const readyRef = useRef<string | null>(null);
  const prefetched = useRef(false);

  useEffect(() => {
    const onHash = () => {
      const next = readRoute();
      if (next.page !== current.current) {
        // Chuyển tiếp khi màn hình hiện tại còn chưa hiện xong: giữ màn hình cũ đang thấy.
        if (readyRef.current === current.current) setLeaving(current.current);
        current.current = next.page;
      }
      setRoute(next);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const onReady = (page: string) => () => {
    readyRef.current = page;
    setReadyPage(page);
    if (!prefetched.current) {
      prefetched.current = true;
      prefetchOtherPages(page);
    }
  };

  useEffect(() => {
    if (!leaving || readyPage !== route.page) return;
    const t = setTimeout(() => setLeaving(null), PAGE_FADE_MS);
    return () => clearTimeout(t);
  }, [leaving, readyPage, route.page]);

  return (
    <>
      <Stage backdrop={backdropOf(route.page)}>
        {leaving && leaving !== route.page && (
          <div key={leaving} className="room-layer" inert>
            <Page page={leaving} panel={null} />
          </div>
        )}
        <div key={route.page} className="room-layer">
          <Page {...route} onReady={onReady(route.page)} />
        </div>
      </Stage>
      <PortraitHint />
    </>
  );
}
