import { useState } from 'react';
import { Plus } from 'lucide-react';
import ConfirmButton from '../ConfirmButton/ConfirmButton';
import { createCategory, deleteCategory, updateCategory } from '../../../services/adminService';
import styles from './CategoryManager.module.css';

/** Add, rename, and delete menu categories. Categories that still hold items cannot be deleted. */
function CategoryManager({ categories, onChanged, onMessage }) {
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null); // { id, name }

  const run = async (action, success) => {
    try {
      await action();
      onMessage(success);
      onChanged();
    } catch (error) {
      onMessage(error.message);
    }
  };

  const add = (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (name.length < 2) return;
    run(() => createCategory({ name, order: categories.length + 1 }), `Added ${name}.`).then(() =>
      setNewName(''),
    );
  };

  const saveRename = (event) => {
    event.preventDefault();
    const name = editing.name.trim();
    if (name.length < 2) return;
    run(() => updateCategory(editing.id, { name }), `Renamed to ${name}.`).then(() =>
      setEditing(null),
    );
  };

  return (
    <div className={styles.manager}>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category._id} className={styles.item}>
            {editing?.id === category._id ? (
              <form className={styles.inline} onSubmit={saveRename}>
                <label className="visually-hidden" htmlFor={`rename-${category._id}`}>
                  New name for {category.name}
                </label>
                <input
                  id={`rename-${category._id}`}
                  className={styles.input}
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  maxLength={40}
                  autoFocus
                />
                <button type="submit" className={styles.save}>
                  Save
                </button>
                <button type="button" className={styles.link} onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span className={styles.name}>
                  {category.name}
                  <span className={styles.count}>{category.itemCount} items</span>
                </span>
                <span className={styles.actions}>
                  <button
                    type="button"
                    className={styles.link}
                    onClick={() => setEditing({ id: category._id, name: category.name })}
                  >
                    Rename
                  </button>
                  <ConfirmButton
                    itemName={category.name}
                    onConfirm={() =>
                      run(() => deleteCategory(category._id), `Deleted ${category.name}.`)
                    }
                  />
                </span>
              </>
            )}
          </li>
        ))}
      </ul>

      <form className={styles.inline} onSubmit={add}>
        <label className="visually-hidden" htmlFor="new-category">
          New category name
        </label>
        <input
          id="new-category"
          className={styles.input}
          placeholder="New category"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={40}
        />
        <button type="submit" className={styles.save} disabled={newName.trim().length < 2}>
          <Plus size={16} aria-hidden="true" /> Add
        </button>
      </form>
    </div>
  );
}

export default CategoryManager;
