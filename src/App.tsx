import { useEffect, useState } from 'react';
import { Stage } from './stage/Stage';
import { PortraitHint } from './stage/PortraitHint';
import { Room } from './room/Room';
import { sports } from './rooms/sports';
import type { RoomConfig } from './room/types';

// Định tuyến bằng hash để build tĩnh chạy được ở mọi host.
// Hiện mới có phòng Sports; trang chủ và các phòng khác dựng ở bước 3.
const ROOMS: Record<string, RoomConfig> = { sports };
const DEFAULT_ROOM = 'sports';

function useRoute() {
  const read = () => location.hash.replace(/^#\/?/, '') || DEFAULT_ROOM;
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onHash = () => setRoute(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

export default function App() {
  const route = useRoute();
  const room = ROOMS[route] ?? ROOMS[DEFAULT_ROOM];
  return (
    <>
      <Stage>
        <Room key={room.id} room={room} />
      </Stage>
      <PortraitHint />
    </>
  );
}
