import { useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader/Loader';
import NavigateOnce from './NavigateOnce';
import useAuth from '../hooks/useAuth';

const STAFF_ONLY_STATE = {
  notice: 'The admin panel is for staff only. You are signed in with a customer account.',
};

/** Admin-only area: guests go to sign in; signed-in customers are sent home with a notice. */
function AdminRoute({ children }) {
  const { user, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) return <Loader fullPage label="Checking your session" />;
  if (!user) return <NavigateOnce to="/login" state={{ from: location }} />;
  if (user.role !== 'admin') return <NavigateOnce to="/" state={STAFF_ONLY_STATE} />;
  return children;
}

export default AdminRoute;
