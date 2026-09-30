import { useState } from 'react';
import { Check } from 'lucide-react';
import Button from '../../common/Button/Button';
import FormField from '../../common/FormField/FormField';
import useAuth from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import { compactErrors, isPhone } from '../../../utils/validators';
import styles from './ProfileForm.module.css';

function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const form = useForm({ name: user.name, phone: user.phone || '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, phone } = form.values;
    const found = compactErrors({
      name: name.trim().length >= 2 ? '' : 'Please enter your name.',
      phone: !phone || isPhone(phone) ? '' : 'Enter a valid phone number.',
    });
    form.setErrors(found);
    form.setFormError('');
    if (Object.keys(found).length) return;

    setStatus('saving');
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      setStatus('saved');
    } catch (error) {
      form.applyServerError(error);
      setStatus('idle');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField label="Full name" autoComplete="name" {...form.field('name')} />
      <FormField label="Phone" type="tel" autoComplete="tel" optional {...form.field('phone')} />
      <FormField
        label="Email"
        type="email"
        value={user.email}
        disabled
        hint="Email cannot be changed in the demo."
        readOnly
      />
      {form.formError && (
        <p className={styles.error} role="alert">
          {form.formError}
        </p>
      )}
      <div className={styles.actions}>
        <Button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving...' : 'Save changes'}
        </Button>
        {status === 'saved' && (
          <p className={styles.saved} role="status">
            <Check size={16} aria-hidden="true" /> Saved
          </p>
        )}
      </div>
    </form>
  );
}

export default ProfileForm;
