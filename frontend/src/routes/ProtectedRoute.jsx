import { useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader/Loader';
import NavigateOnce from './NavigateOnce';
import useAuth from '../hooks/useAuth';

/** Renders children for signed-in users; otherwise sends them to sign in and back. */
function ProtectedRoute({ children }) {
  const { user, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) return <Loader fullPage label="Checking your session" />;
  if (!user) return <NavigateOnce to="/login" state={{ from: location }} />;
  return children;
}

export default ProtectedRoute;
