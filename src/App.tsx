import { useEffect, useRef, useState } from 'react';
import { Stage } from './stage/Stage';
import { PortraitHint } from './stage/PortraitHint';
import { Room } from './room/Room';
import { sports } from './rooms/sports';
import { robotics } from './rooms/robotics';
import { community } from './rooms/community';
import { iar } from './rooms/iar';
import type { RoomConfig } from './room/types';

// Định tuyến bằng hash để build tĩnh chạy được ở mọi host.
// Trang chủ chưa dựng (chờ quyết định, xem NOTES.md); mặc định vào Sports (Flow 1 của prototype).
const ROOMS: Record<string, RoomConfig> = { sports, robotics, community, iar };
const DEFAULT_ROOM = 'sports';
// Khớp với --dur trong styles.css (Smart Animate 300ms giữa hai phòng).
const ROOM_FADE_MS = 300;

const readRoute = () => {
  const id = location.hash.replace(/^#\/?/, '');
  return id in ROOMS ? id : DEFAULT_ROOM;
};

export default function App() {
  const [route, setRoute] = useState(readRoute);
  // Phòng cũ còn nằm bên dưới trong lúc phòng mới mờ dần vào.
  const [leaving, setLeaving] = useState<string | null>(null);
  const current = useRef(route);

  useEffect(() => {
    const onHash = () => {
      const next = readRoute();
      if (next === current.current) return;
      setLeaving(current.current);
      current.current = next;
      setRoute(next);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setLeaving(null), ROOM_FADE_MS);
    return () => clearTimeout(t);
  }, [leaving, route]);

  return (
    <>
      <Stage>
        {leaving && leaving !== route && (
          <div key={leaving} className="room-layer" data-leaving inert>
            <Room room={ROOMS[leaving]} />
          </div>
        )}
        <div key={route} className="room-layer" data-entering={leaving ? true : undefined}>
          <Room room={ROOMS[route]} />
        </div>
      </Stage>
      <PortraitHint />
    </>
  );
}
