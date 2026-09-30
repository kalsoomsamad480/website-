import { useLocation } from 'react-router-dom';
import NavigateOnce from '../../routes/NavigateOnce';
import SEO from '../../components/common/SEO/SEO';
import AuthShell from '../../components/auth/AuthShell/AuthShell';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import useAuth from '../../hooks/useAuth';
import redirectTarget from '../../utils/redirectTarget';

function Login() {
  const { user } = useAuth();
  const location = useLocation();

  if (user) return <NavigateOnce to={redirectTarget(location.state, user)} />;

  return (
    <>
      <SEO noIndex title="Sign in" description="Sign in to your Alladin Cafe account." />
      <AuthShell
        eyebrow="Welcome back"
        title={
          <>
            Good to see you <em>again</em>.
          </>
        }
        intro="Sign in to order ahead, see your orders, and manage your reservations."
      >
        <LoginForm redirectState={location.state} />
      </AuthShell>
    </>
  );
}

export default Login;
