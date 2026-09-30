import { useLocation } from 'react-router-dom';
import NavigateOnce from '../../routes/NavigateOnce';
import SEO from '../../components/common/SEO/SEO';
import AuthShell from '../../components/auth/AuthShell/AuthShell';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import useAuth from '../../hooks/useAuth';
import redirectTarget from '../../utils/redirectTarget';

function Register() {
  const { user } = useAuth();
  const location = useLocation();

  if (user) return <NavigateOnce to={redirectTarget(location.state, user)} />;

  return (
    <>
      <SEO noIndex title="Create account" description="Create a Alladin Cafe account." />
      <AuthShell
        eyebrow="Join the regulars"
        title={
          <>
            Make yourself at <em>home</em>.
          </>
        }
        intro="An account keeps your details handy, so ordering and booking take seconds."
      >
        <RegisterForm redirectState={location.state} />
      </AuthShell>
    </>
  );
}

export default Register;
