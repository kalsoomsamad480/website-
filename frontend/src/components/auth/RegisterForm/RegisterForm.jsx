import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import FormField from '../../common/FormField/FormField';
import useAuth from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import { compactErrors, isEmail, isPhone, passwordProblem } from '../../../utils/validators';
import styles from '../AuthForm/AuthForm.module.css';

function RegisterForm({ redirectState }) {
  const { register } = useAuth();
  const form = useForm({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, phone, password, confirm } = form.values;
    const found = compactErrors({
      name: name.trim().length >= 2 ? '' : 'Please enter your name.',
      email: isEmail(email) ? '' : 'Enter a valid email address.',
      phone: !phone || isPhone(phone) ? '' : 'Enter a valid phone number.',
      password: passwordProblem(password),
      confirm: confirm === password ? '' : 'Passwords do not match.',
    });
    form.setErrors(found);
    form.setFormError('');
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
    } catch (error) {
      form.applyServerError(error);
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField label="Full name" autoComplete="name" {...form.field('name')} />
      <div className={styles.row}>
        <FormField label="Email" type="email" autoComplete="email" {...form.field('email')} />
        <FormField label="Phone" type="tel" autoComplete="tel" optional {...form.field('phone')} />
      </div>
      <FormField
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters, with a letter and a number."
        {...form.field('password')}
      />
      <FormField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        {...form.field('confirm')}
      />

      {form.formError && (
        <p className={styles.formError} role="alert">
          {form.formError}
        </p>
      )}

      <Button type="submit" size="lg" icon={ArrowRight} fullWidth disabled={submitting}>
        {submitting ? 'Creating your account...' : 'Create account'}
      </Button>

      <p className={styles.switch}>
        Already have an account?{' '}
        <Link to="/login" state={redirectState}>
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
