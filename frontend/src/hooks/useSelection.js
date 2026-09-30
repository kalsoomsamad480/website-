import { useCallback, useState } from 'react';

/**
 * Tracks a selected value plus an open flag. Closing keeps the value so dialogs can finish
 * their exit animation with content still rendered.
 */
export default function useSelection() {
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((value) => {
    setSelected(value);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return { selected, setSelected, isOpen, open, close };
}
