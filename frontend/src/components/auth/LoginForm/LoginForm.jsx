import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import FormField from '../../common/FormField/FormField';
import useAuth from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import { compactErrors, isEmail } from '../../../utils/validators';
import styles from '../AuthForm/AuthForm.module.css';

// Seeded demo accounts (documented in the README). Shown only in local development,
// so a deployed site never publishes passwords.
const SHOW_DEMO = import.meta.env.DEV;
const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'customer@alladin.cafe', password: 'Customer@123' },
  { label: 'Admin', email: 'admin@alladin.cafe', password: 'Admin@123' },
];

function LoginForm({ redirectState }) {
  const { login } = useAuth();
  const form = useForm({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = compactErrors({
      email: isEmail(form.values.email) ? '' : 'Enter a valid email address.',
      password: form.values.password ? '' : 'Enter your password.',
    });
    form.setErrors(found);
    form.setFormError('');
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await login(form.values); // the page redirects once the user is set
    } catch (error) {
      form.applyServerError(error);
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField label="Email" type="email" autoComplete="email" {...form.field('email')} />
      <FormField
        label="Password"
        type="password"
        autoComplete="current-password"
        {...form.field('password')}
      />

      {form.formError && (
        <p className={styles.formError} role="alert">
          {form.formError}
        </p>
      )}

      <Button type="submit" size="lg" icon={ArrowRight} fullWidth disabled={submitting}>
        {submitting ? 'Signing in...' : 'Sign in'}
      </Button>

      {SHOW_DEMO && (
        <div className={styles.demo}>
          <p className={styles.demoTitle}>Trying the demo?</p>
          <p>Fill in a sample account with one click.</p>
          <div className={styles.demoButtons}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.label}
                type="button"
                className={styles.demoButton}
                onClick={() => form.setValues({ email: account.email, password: account.password })}
              >
                {account.label} account
              </button>
            ))}
          </div>
        </div>
      )}

      <p className={styles.switch}>
        New to Alladin Cafe?{' '}
        <Link to="/register" state={redirectState}>
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
