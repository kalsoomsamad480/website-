import { useEffect } from 'react';

/** Locks page scroll while `locked` is true, without shifting the layout. */
export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}
