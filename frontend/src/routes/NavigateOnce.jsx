import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Like <Navigate>, but fires only once per mount. Pages stay mounted during their exit
 * animation and keep re-rendering; a plain <Navigate> would redirect again on every render.
 */
function NavigateOnce({ to, state, replace = true }) {
  const navigate = useNavigate();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    navigate(to, { replace, state });
  }, [navigate, to, state, replace]);

  return null;
}

export default NavigateOnce;
