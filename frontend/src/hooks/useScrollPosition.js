import { useEffect, useState } from 'react';

/** Returns true once the page has scrolled past `threshold` pixels. */
export default function useScrollPosition(threshold = 0) {
  const [isPast, setIsPast] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIsPast(window.scrollY > threshold));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return isPast;
}
