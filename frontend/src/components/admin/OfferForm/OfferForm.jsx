import { useState } from 'react';
import Button from '../../common/Button/Button';
import FormField from '../../common/FormField/FormField';
import useForm from '../../../hooks/useForm';
import { createOffer, updateOffer } from '../../../services/adminService';
import { toDateString } from '../../../utils/formatDate';
import { compactErrors } from '../../../utils/validators';
import styles from '../adminForm.module.css';

function OfferForm({ offer, onSaved }) {
  const form = useForm({
    title: offer?.title || '',
    description: offer?.description || '',
    discountText: offer?.discountText || '',
    image: offer?.image || '/images/offers/',
    validTill: offer ? toDateString(new Date(offer.validTill)) : '',
  });
  const [isActive, setIsActive] = useState(offer?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v = form.values;
    const found = compactErrors({
      title: v.title.trim().length >= 2 ? '' : 'Title must be at least 2 characters.',
      description:
        v.description.trim().length >= 10 ? '' : 'Description must be at least 10 characters.',
      validTill: v.validTill ? '' : 'Choose an end date.',
    });
    form.setErrors(found);
    form.setFormError('');
    if (Object.keys(found).length) return;

    const payload = {
      title: v.title.trim(),
      description: v.description.trim(),
      discountText: v.discountText.trim(),
      image: v.image.trim(),
      // End of the chosen day, in the cafe's local time
      validTill: new Date(`${v.validTill}T23:59:59`).toISOString(),
      isActive,
    };

    setSaving(true);
    try {
      const saved = offer ? await updateOffer(offer._id, payload) : await createOffer(payload);
      onSaved(saved, offer ? 'updated' : 'created');
    } catch (error) {
      form.applyServerError(error);
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 id="offer-form-title" className={styles.title}>
        {offer ? 'Edit offer' : 'New offer'}
      </h2>
      <FormField label="Title" maxLength={80} {...form.field('title')} />
      <FormField as="textarea" label="Description" maxLength={300} {...form.field('description')} />
      <div className={styles.row}>
        <FormField
          label="Label"
          hint="Short, e.g. 20% off"
          optional
          maxLength={30}
          {...form.field('discountText')}
        />
        <FormField
          label="Valid until"
          type="date"
          min={toDateString(new Date())}
          {...form.field('validTill')}
        />
      </div>
      <FormField label="Image path" optional {...form.field('image')} />
      <label className={styles.check}>
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Show on the website
      </label>
      {form.formError && (
        <p className={styles.error} role="alert">
          {form.formError}
        </p>
      )}
      <Button type="submit" disabled={saving} fullWidth>
        {saving ? 'Saving...' : offer ? 'Save changes' : 'Create offer'}
      </Button>
    </form>
  );
}

export default OfferForm;
