import { useState } from 'react';
import { Plus } from 'lucide-react';
import SEO from '../../../components/common/SEO/SEO';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Modal from '../../../components/common/Modal/Modal';
import AdminPageHeader from '../../../components/admin/AdminPageHeader/AdminPageHeader';
import AdminState from '../../../components/admin/AdminState/AdminState';
import CategoryManager from '../../../components/admin/CategoryManager/CategoryManager';
import ConfirmButton from '../../../components/admin/ConfirmButton/ConfirmButton';
import DataTable from '../../../components/admin/DataTable/DataTable';
import MenuForm from '../../../components/admin/MenuForm/MenuForm';
import Panel from '../../../components/admin/Panel/Panel';
import Switch from '../../../components/admin/Switch/Switch';
import useAdminData from '../../../hooks/useAdminData';
import useSelection from '../../../hooks/useSelection';
import {
  deleteMenuItem,
  getAdminCategories,
  getAdminMenu,
  setMenuAvailability,
} from '../../../services/adminService';
import formatPrice from '../../../utils/formatPrice';
import styles from '../adminPage.module.css';
import local from './ManageMenu.module.css';

const loadMenuData = () =>
  Promise.all([getAdminMenu(), getAdminCategories()]).then(([items, categories]) => ({
    items,
    categories,
  }));

function ManageMenu() {
  const menu = useAdminData(loadMenuData);
  const editor = useSelection();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState(null);

  const items = menu.data?.items || [];
  const categories = menu.data?.categories || [];
  const query = search.trim().toLowerCase();
  const visible = items.filter(
    (item) =>
      (category === 'all' || item.category?._id === category) &&
      (!query || item.name.toLowerCase().includes(query)),
  );

  const toggle = async (item, isAvailable) => {
    setBusyId(item._id);
    try {
      await setMenuAvailability(item._id, isAvailable);
      menu.setData((d) => ({
        ...d,
        items: d.items.map((i) => (i._id === item._id ? { ...i, isAvailable } : i)),
      }));
      setMessage(`${item.name} is now ${isAvailable ? 'available' : 'sold out'}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item) => {
    try {
      await deleteMenuItem(item._id);
      setMessage(`${item.name} was removed from the menu.`);
      menu.reload();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <SEO noIndex title="Menu" />
      <AdminPageHeader
        title="Menu"
        description="Changes show on the website straight away."
        actions={
          <Button
            size="sm"
            icon={Plus}
            onClick={() => editor.open(null)}
            disabled={!categories.length}
          >
            Add item
          </Button>
        }
      />
      <p className={styles.status} role="status">
        {message}
      </p>

      <AdminState data={menu.data} error={menu.error} onRetry={menu.reload}>
        <div className={local.layout}>
          <Panel
            flush
            title={`${visible.length} items`}
            actions={
              <div className={local.filters}>
                <label className="visually-hidden" htmlFor="menu-admin-search">
                  Search items
                </label>
                <input
                  id="menu-admin-search"
                  className={styles.input}
                  placeholder="Search by name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <label className="visually-hidden" htmlFor="menu-admin-category">
                  Category
                </label>
                <select
                  id="menu-admin-category"
                  className={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length ? (
              <DataTable caption="Menu items" minWidth={760}>
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Available</th>
                    <th scope="col">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className={local.item}>
                          <img
                            src={item.image}
                            alt=""
                            width={48}
                            height={48}
                            className={local.thumb}
                          />
                          <span>
                            <strong>{item.name}</strong>
                            <span className={local.tags}>{item.tags.join(', ') || 'No tags'}</span>
                          </span>
                        </div>
                      </td>
                      <td>{item.category?.name}</td>
                      <td>
                        <strong>{formatPrice(item.price)}</strong>
                      </td>
                      <td>
                        <Switch
                          checked={item.isAvailable}
                          disabled={busyId === item._id}
                          onChange={(value) => toggle(item, value)}
                          label={`${item.name} available today`}
                        />
                      </td>
                      <td>
                        <div className={local.actions}>
                          <button
                            type="button"
                            className={local.edit}
                            onClick={() => editor.open(item)}
                          >
                            Edit<span className="visually-hidden"> {item.name}</span>
                          </button>
                          <ConfirmButton itemName={item.name} onConfirm={() => remove(item)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            ) : (
              <EmptyState title="No items match." text="Try another search or category." />
            )}
          </Panel>

          <Panel title="Categories">
            <CategoryManager
              categories={categories}
              onChanged={menu.reload}
              onMessage={setMessage}
            />
          </Panel>
        </div>
      </AdminState>

      <Modal open={editor.isOpen} onClose={editor.close} labelledBy="menu-form-title" size="sm">
        {editor.isOpen && (
          <MenuForm
            key={editor.selected?._id || 'new'}
            item={editor.selected}
            categories={categories}
            onSaved={(saved, verb) => {
              setMessage(`${saved.name} ${verb}.`);
              editor.close();
              menu.reload();
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default ManageMenu;
