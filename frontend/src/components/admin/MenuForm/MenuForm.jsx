import { useState } from 'react';
import Button from '../../common/Button/Button';
import FormField from '../../common/FormField/FormField';
import useForm from '../../../hooks/useForm';
import { createMenuItem, updateMenuItem } from '../../../services/adminService';
import { capitalize, MENU_TAGS } from '../../../utils/adminConstants';
import { compactErrors } from '../../../utils/validators';
import styles from '../adminForm.module.css';

const toForm = (item, categories) => ({
  name: item?.name || '',
  description: item?.description || '',
  price: item ? String(item.price) : '',
  category: item?.category?._id || item?.category || categories[0]?._id || '',
  ingredients: item?.ingredients?.join(', ') || '',
  image: item?.image || '',
  calories: item?.calories != null ? String(item.calories) : '',
});

/** Create or edit a menu item. Used inside a Modal. */
function MenuForm({ item, categories, onSaved }) {
  const form = useForm(toForm(item, categories));
  const [tags, setTags] = useState(item?.tags || []);
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag) =>
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v = form.values;
    const price = Number(v.price);
    const found = compactErrors({
      name: v.name.trim().length >= 2 ? '' : 'Name must be at least 2 characters.',
      description:
        v.description.trim().length >= 10 ? '' : 'Description must be at least 10 characters.',
      price:
        v.price !== '' && price >= 0 && price <= 1000 ? '' : 'Enter a price between 0 and 1000.',
      calories:
        v.calories === '' || Number.isInteger(Number(v.calories))
          ? ''
          : 'Calories must be a whole number.',
    });
    form.setErrors(found);
    form.setFormError('');
    if (Object.keys(found).length) return;

    const payload = {
      name: v.name.trim(),
      description: v.description.trim(),
      price: Math.round(price * 100) / 100,
      category: v.category,
      tags,
      ingredients: v.ingredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      image: v.image.trim(),
      isAvailable,
      ...(v.calories !== '' ? { calories: Number(v.calories) } : {}),
    };

    setSaving(true);
    try {
      const saved = item ? await updateMenuItem(item._id, payload) : await createMenuItem(payload);
      onSaved(saved, item ? 'updated' : 'created');
    } catch (error) {
      form.applyServerError(error);
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 id="menu-form-title" className={styles.title}>
        {item ? 'Edit item' : 'New menu item'}
      </h2>
      <FormField label="Name" {...form.field('name')} />
      <FormField as="textarea" label="Description" maxLength={300} {...form.field('description')} />
      <div className={styles.row}>
        <FormField
          label="Price ($)"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          {...form.field('price')}
        />
        <div className={styles.field}>
          <label htmlFor="menu-category" className={styles.label}>
            Category
          </label>
          <select
            id="menu-category"
            className={styles.select}
            value={form.values.category}
            onChange={form.field('category').onChange}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Tags</legend>
        <div className={styles.checks}>
          {MENU_TAGS.map((tag) => (
            <label key={tag} className={styles.check}>
              <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} />
              {tag === 'veg' ? 'Vegetarian' : capitalize(tag)}
            </label>
          ))}
        </div>
      </fieldset>

      <FormField
        label="Ingredients"
        hint="Separate with commas."
        optional
        {...form.field('ingredients')}
      />
      <div className={styles.row}>
        <FormField
          label="Image path"
          hint="For example /images/menu/flat-white.webp"
          optional
          {...form.field('image')}
        />
        <FormField label="Calories" type="number" min="0" optional {...form.field('calories')} />
      </div>
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
        Available today
      </label>

      {form.formError && (
        <p className={styles.error} role="alert">
          {form.formError}
        </p>
      )}
      <Button type="submit" disabled={saving} fullWidth>
        {saving ? 'Saving...' : item ? 'Save changes' : 'Add to menu'}
      </Button>
    </form>
  );
}

export default MenuForm;
