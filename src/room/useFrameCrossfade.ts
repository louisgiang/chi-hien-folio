import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

// All frame weights share one timeline and always sum to 1. Together with
// plus-lighter this prevents the base image leaking through between hover frames.
export function useFrameCrossfade(container: RefObject<HTMLDivElement | null>, active: number) {
  const animations = useRef<Animation[]>([]);

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.frame'));
    // Sample BEFORE cancelling: rapid A → B → C continues from the visible mix,
    // rather than snapping the outgoing frame back to full opacity.
    const weights = frames.map((frame) => Number(getComputedStyle(frame).opacity));
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];

    const css = getComputedStyle(root);
    const time = css.getPropertyValue('--dur').trim();
    const duration = parseFloat(time) * (time.endsWith('ms') ? 1 : 1000);
    const easing = css.getPropertyValue('--ease').trim();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startTime = document.timeline.currentTime;

    frames.forEach((frame, index) => {
      const target = index === active ? 1 : 0;
      // The final value is already in place when an animation finishes/cancels.
      frame.style.opacity = String(target);
      if (reduced || !duration || weights[index] === target) return;
      const animation = frame.animate(
        [{ opacity: weights[index] }, { opacity: target }],
        { duration, easing },
      );
      animation.startTime = startTime;
      animations.current.push(animation);
    });
  }, [container, active]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (motion.matches) animations.current.forEach((animation) => animation.finish());
    };
    motion.addEventListener('change', onChange);
    return () => {
      motion.removeEventListener('change', onChange);
      animations.current.forEach((animation) => animation.cancel());
    };
  }, []);
}
