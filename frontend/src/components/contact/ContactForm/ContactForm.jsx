import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Button from '../../common/Button/Button';
import FormField from '../../common/FormField/FormField';
import { sendContactMessage } from '../../../services/contactService';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './ContactForm.module.css';

const EMPTY = { name: '', email: '', subject: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the backend rules so most mistakes are caught before sending
function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setServerError('');
    if (Object.keys(found).length) return;

    setStatus('sending');
    try {
      const response = await sendContactMessage(values);
      setSuccessMessage(response.message);
      setStatus('sent');
      setValues(EMPTY);
    } catch (error) {
      const fieldErrors = Object.fromEntries(
        error.fieldErrors.map((item) => [item.field, item.message]),
      );
      setErrors(fieldErrors);
      setServerError(error.message);
      setStatus('idle');
    }
  };

  return (
    <div className={styles.card}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            className={styles.success}
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
            exit={{ opacity: 0 }}
          >
            <span className="eyebrow">Message sent</span>
            <h2 className={styles.title}>
              Thank <em>you</em>.
            </h2>
            <p className="lead">{successMessage}</p>
            <Button variant="ghost" onClick={() => setStatus('idle')}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className={styles.title}>
              Send us a <em>note</em>.
            </h2>
            <div className={styles.row}>
              <FormField
                label="Name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={update('name')}
                error={errors.name}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={update('email')}
                error={errors.email}
              />
            </div>
            <FormField
              label="Subject"
              name="subject"
              optional
              value={values.subject}
              onChange={update('subject')}
              error={errors.subject}
              placeholder="Events, feedback, or anything else"
            />
            <FormField
              as="textarea"
              label="Message"
              name="message"
              value={values.message}
              onChange={update('message')}
              error={errors.message}
              maxLength={2000}
            />
            {serverError && (
              <p className={styles.serverError} role="alert">
                {serverError}
              </p>
            )}
            <Button type="submit" size="lg" icon={Send} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactForm;
