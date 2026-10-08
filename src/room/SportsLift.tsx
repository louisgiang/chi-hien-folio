import type { CSSProperties } from 'react';
import type { RoomConfig } from './types';
import { SportsKey } from './SportsKey';

const SPRITES = import.meta.glob<string>('../assets/sports/*-above-*.webp', { eager: true, import: 'default' });
const LAYERS = { racket: 'badminton-above-racket', shoes: 'soccer-above-ball' };
export const hasSportsLift = (room: RoomConfig, id: string | null) =>
  room.id === 'sports' && id !== null && (id in LAYERS || id === 'whistle');

export function SportsLift({ room, lit, openObject }: { room: RoomConfig; lit: string | null; openObject: string | null }) {
  if (room.id !== 'sports') return null;
  return (
    <div className="sports-lift" aria-hidden="true">
      {/* Rebuild only the flat cyan surfaces behind the two exported sprites.
          The cabinet, labels, menu, and all other artwork remain in the frame. */}
      <svg className="sports-lift__plate" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <filter id="sports-solid-alpha" colorInterpolationFilters="sRGB">
            {/* The exported glow is white. Remove its color rather than
                thresholding alpha: the racket strings are translucent too. */}
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -8 -8 -8 0 24" result="colorMask" />
            <feComposite in="SourceGraphic" in2="colorMask" operator="in" />
          </filter>
        </defs>
        <path fill="rgb(0 203 201)" d="M0 270H423V1080H0Z" />
        <path fill="rgb(0 185 184)" d="M446 273L575 297L576 752L448 780Z" />
        <path fill="rgb(0 203 201)" d="M575 297L782 335L781 740L576 752Z" />
        <path fill="rgb(0 255 244)" d="M782 335L823 343L824 854L448 780L576 752L781 740Z" />
      </svg>
      {room.objects.filter((o) => o.id in LAYERS).map((o) => {
        const asset = LAYERS[o.id as keyof typeof LAYERS];
        const box = room.overlays![asset];
        const sx = o.base.w / o.hover.w;
        const sy = o.base.h / o.hover.h;
        const x = o.base.x + (box.x - o.hover.x) * sx;
        const y = o.base.y + (box.y - o.hover.y) * sy;
        const style = {
          left: box.x, top: box.y, width: box.w, height: box.h,
          '--rest-transform': `translate3d(${x - box.x}px, ${y - box.y}px, 0) scale(${sx}, ${sy})`,
        } as CSSProperties;
        const src = SPRITES[`../assets/sports/${asset}.webp`];
        return (
          <div key={o.id} className="sports-lift__object" data-object={o.id} data-active={lit === o.id || undefined} data-popup={openObject === o.id || undefined} style={style}>
            <img className="sports-lift__solid" src={src} alt="" draggable={false} />
            <img className="sports-lift__glow" src={src} alt="" draggable={false} />
          </div>
        );
      })}
      <SportsKey object={room.objects.find((o) => o.id === 'whistle')!} active={lit === 'whistle'} />
    </div>
  );
}
