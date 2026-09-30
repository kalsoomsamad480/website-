import { useCallback, useState } from 'react';

/**
 * Minimal form state: values, per-field errors, and a form-level error.
 * `field(name)` returns props for <FormField>.
 */
export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [name]: value }));
      setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    },
  });

  /** Maps an API error ({ message, fieldErrors }) onto the form. */
  const applyServerError = useCallback((error) => {
    setErrors(Object.fromEntries(error.fieldErrors.map((item) => [item.field, item.message])));
    setFormError(error.message);
  }, []);

  return { values, setValues, errors, setErrors, formError, setFormError, field, applyServerError };
}
