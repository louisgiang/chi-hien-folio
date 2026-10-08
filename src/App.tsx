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

function Page({ page, panel }: Route) {
  return page === 'home' ? <Home panel={panel} /> : <Room room={ROOMS[page]} />;
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  // Màn hình cũ còn nằm bên dưới trong lúc màn hình mới mờ dần vào.
  const [leaving, setLeaving] = useState<string | null>(null);
  const current = useRef(route.page);

  useEffect(() => {
    const onHash = () => {
      const next = readRoute();
      if (next.page !== current.current) {
        setLeaving(current.current);
        current.current = next.page;
      }
      setRoute(next);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setLeaving(null), PAGE_FADE_MS);
    return () => clearTimeout(t);
  }, [leaving, route.page]);

  return (
    <>
      <Stage backdrop={backdropOf(route.page)}>
        {leaving && leaving !== route.page && (
          <div key={leaving} className="room-layer" inert>
            <Page page={leaving} panel={null} />
          </div>
        )}
        <div key={route.page} className="room-layer" data-entering={leaving ? true : undefined}>
          <Page {...route} />
        </div>
      </Stage>
      <PortraitHint />
    </>
  );
}
