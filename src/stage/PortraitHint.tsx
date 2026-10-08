import { useEffect, useState } from 'react';
import './PortraitHint.css';

const QUERY = '(orientation: portrait) and (pointer: coarse)';

// Điện thoại dọc: gợi ý xoay ngang, nhưng vẫn cho xem nếu không xoay.
export function PortraitHint() {
  const [portrait, setPortrait] = useState(() => matchMedia(QUERY).matches);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const mq = matchMedia(QUERY);
    const onChange = () => setPortrait(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (!portrait || dismissed) return null;
  return (
    <div className="portrait-hint" role="dialog" aria-label="Gợi ý xoay màn hình">
      <div className="portrait-hint__icon" aria-hidden="true" />
      <p>Xoay ngang điện thoại để xem trọn khung hình.</p>
      <button type="button" onClick={() => setDismissed(true)}>Vẫn xem dọc</button>
    </div>
  );
}
