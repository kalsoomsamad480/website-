import { useState } from 'react';
import Button from '../../common/Button/Button';
import FormField from '../../common/FormField/FormField';
import useForm from '../../../hooks/useForm';
import { createTestimonial, updateTestimonial } from '../../../services/adminService';
import { compactErrors } from '../../../utils/validators';
import styles from '../adminForm.module.css';

function TestimonialForm({ testimonial, onSaved }) {
  const form = useForm({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    message: testimonial?.message || '',
    avatar: testimonial?.avatar || '',
  });
  const [rating, setRating] = useState(testimonial?.rating || 5);
  const [isVisible, setIsVisible] = useState(testimonial?.isVisible ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v = form.values;
    const found = compactErrors({
      name: v.name.trim().length >= 2 ? '' : 'Name must be at least 2 characters.',
      message: v.message.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
    });
    form.setErrors(found);
    form.setFormError('');
    if (Object.keys(found).length) return;

    const payload = {
      name: v.name.trim(),
      role: v.role.trim(),
      message: v.message.trim(),
      avatar: v.avatar.trim(),
      rating,
      isVisible,
    };
    setSaving(true);
    try {
      const saved = testimonial
        ? await updateTestimonial(testimonial._id, payload)
        : await createTestimonial(payload);
      onSaved(saved, testimonial ? 'updated' : 'added');
    } catch (error) {
      form.applyServerError(error);
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 id="testimonial-form-title" className={styles.title}>
        {testimonial ? 'Edit testimonial' : 'New testimonial'}
      </h2>
      <div className={styles.row}>
        <FormField label="Name" maxLength={60} {...form.field('name')} />
        <FormField
          label="Role"
          hint="e.g. Medical student"
          optional
          maxLength={60}
          {...form.field('role')}
        />
      </div>
      <FormField as="textarea" label="Message" maxLength={400} {...form.field('message')} />
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="testimonial-rating" className={styles.label}>
            Rating
          </label>
          <select
            id="testimonial-rating"
            className={styles.select}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} out of 5
              </option>
            ))}
          </select>
        </div>
        <FormField label="Photo path" optional {...form.field('avatar')} />
      </div>
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
        />
        Show on the home page
      </label>
      {form.formError && (
        <p className={styles.error} role="alert">
          {form.formError}
        </p>
      )}
      <Button type="submit" disabled={saving} fullWidth>
        {saving ? 'Saving...' : testimonial ? 'Save changes' : 'Add testimonial'}
      </Button>
    </form>
  );
}

export default TestimonialForm;
