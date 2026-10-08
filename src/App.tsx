import { useEffect, useRef, useState } from 'react';
import { Stage } from './stage/Stage';
import { PortraitHint } from './stage/PortraitHint';
import { Room } from './room/Room';
import { Home } from './home/Home';
import type { HomePanelId } from './home/homeConfig';
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

const readRoute = (): Route => {
  const id = location.hash.replace(/^#\/?/, '');
  if (id in ROOMS) return { page: id, panel: null };
  return { page: 'home', panel: HOME_PANELS.includes(id as HomePanelId) ? (id as HomePanelId) : null };
};

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
      <Stage>
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
