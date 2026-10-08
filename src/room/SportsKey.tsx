import type { CSSProperties } from 'react';
import baseImage from '../assets/sports/sports-base-2x.webp';
import type { RoomObject } from './types';

// Trace the key in the existing 2x artwork. The orange lock socket stays fixed.
// Coordinates use the same 1920 x 1080 stage as the source frame.
const KEY_OUTLINE = 'M1378.5 767.3 L1388 770.5 L1396.5 765.8 L1411.5 770.8 L1403.8 776.2 L1410.3 778.8 L1410.3 791.5 L1382 804.2 L1377.2 803.1 Q1372 812.4 1365.2 808.7 Q1355.5 804.2 1358.5 793.2 L1348.8 789.5 L1349.5 778.5 Z';

export function SportsKey({ object, active }: { object: RoomObject; active: boolean }) {
  const { base, hover } = object;
  const style = {
    left: hover.x, top: hover.y, width: hover.w, height: hover.h,
    '--rest-transform': `translate3d(${base.x - hover.x}px, ${base.y - hover.y}px, 0) scale(${base.w / hover.w}, ${base.h / hover.h})`,
  } as CSSProperties;
  return (
    <>
      <svg className="sports-lift__plate" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <clipPath id="sports-key-outline"><path d={KEY_OUTLINE} /></clipPath>
          <mask id="sports-key-repair" maskUnits="userSpaceOnUse" x="1340" y="760" width="80" height="60">
            <path d={KEY_OUTLINE} fill="white" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          </mask>
        </defs>
        {/* Repair just the old key silhouette using the cabinet's flat planes.
            Everything outside that silhouette, including the socket, is intact. */}
        <g mask="url(#sports-key-repair)">
          <path fill="rgb(214 169 0)" d="M1340 760H1420V820H1340Z" />
          <path fill="rgb(206 109 34)" d="M1340 760H1360.8L1362 820H1340Z" />
          <path fill="rgb(237 124 41)" d="M1379 760H1433V813Q1430 819 1423 817L1383 803Q1379 801 1379 795Z" />
          <path fill="rgb(254 162 31)" d="M1389 760H1421L1422 805L1389 794Z" />
        </g>
      </svg>
      {/* No data-popup: the key stays behind the Swimming glass, as designed. */}
      <div className="sports-lift__object" data-object={object.id} data-active={active || undefined} style={style}>
        <svg className="sports-lift__key" viewBox="1339 733 101 87" preserveAspectRatio="none">
          <image href={baseImage} width="1920" height="1080" clipPath="url(#sports-key-outline)" />
        </svg>
        <svg className="sports-lift__key sports-lift__glow sports-lift__key-glow" viewBox="1339 733 101 87" preserveAspectRatio="none">
          <image href={baseImage} width="1920" height="1080" clipPath="url(#sports-key-outline)" />
        </svg>
      </div>
    </>
  );
}
