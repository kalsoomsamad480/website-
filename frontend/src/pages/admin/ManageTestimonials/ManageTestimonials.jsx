import { useState } from 'react';
import { Plus } from 'lucide-react';
import SEO from '../../../components/common/SEO/SEO';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Modal from '../../../components/common/Modal/Modal';
import AdminPageHeader from '../../../components/admin/AdminPageHeader/AdminPageHeader';
import AdminState from '../../../components/admin/AdminState/AdminState';
import ConfirmButton from '../../../components/admin/ConfirmButton/ConfirmButton';
import Switch from '../../../components/admin/Switch/Switch';
import TestimonialForm from '../../../components/admin/TestimonialForm/TestimonialForm';
import useAdminData from '../../../hooks/useAdminData';
import useSelection from '../../../hooks/useSelection';
import {
  deleteTestimonial,
  getAllTestimonials,
  updateTestimonial,
} from '../../../services/adminService';
import styles from '../adminPage.module.css';
import local from './ManageTestimonials.module.css';

function ManageTestimonials() {
  const testimonials = useAdminData(getAllTestimonials);
  const editor = useSelection();
  const [message, setMessage] = useState('');

  const toggle = async (item, isVisible) => {
    try {
      const updated = await updateTestimonial(item._id, { isVisible });
      testimonials.setData((list) => list.map((t) => (t._id === updated._id ? updated : t)));
      setMessage(`${item.name}'s review is now ${isVisible ? 'shown' : 'hidden'}.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <SEO noIndex title="Testimonials" />
      <AdminPageHeader
        title="Testimonials"
        description="Visible reviews rotate in the home page slider."
        actions={
          <Button size="sm" icon={Plus} onClick={() => editor.open(null)}>
            Add testimonial
          </Button>
        }
      />
      <p className={styles.status} role="status">
        {message}
      </p>

      <AdminState data={testimonials.data} error={testimonials.error} onRetry={testimonials.reload}>
        {testimonials.data?.length ? (
          <ul className={styles.cards}>
            {testimonials.data.map((item) => (
              <li key={item._id} className={`${local.card} ${item.isVisible ? '' : local.hidden}`}>
                <blockquote className={local.quote}>{item.message}</blockquote>
                <div className={local.person}>
                  {item.avatar && (
                    <img src={item.avatar} alt="" width={44} height={44} className={local.avatar} />
                  )}
                  <span>
                    <strong>{item.name}</strong>
                    <span className={local.meta}>
                      {item.role ? `${item.role}, ` : ''}
                      {item.rating} out of 5
                    </span>
                  </span>
                </div>
                <div className={local.actions}>
                  <Switch
                    checked={item.isVisible}
                    onChange={(v) => toggle(item, v)}
                    label={`Show ${item.name}'s review`}
                  />
                  <span className={local.state}>{item.isVisible ? 'Shown' : 'Hidden'}</span>
                  <span className={local.spacer} />
                  <button type="button" className={local.edit} onClick={() => editor.open(item)}>
                    Edit<span className="visually-hidden"> {item.name}</span>
                  </button>
                  <ConfirmButton
                    itemName={item.name}
                    onConfirm={async () => {
                      try {
                        await deleteTestimonial(item._id);
                        setMessage(`${item.name}'s review deleted.`);
                        testimonials.reload();
                      } catch (error) {
                        setMessage(error.message);
                      }
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No testimonials yet." text="Add a favorite review from a regular." />
        )}
      </AdminState>

      <Modal
        open={editor.isOpen}
        onClose={editor.close}
        labelledBy="testimonial-form-title"
        size="sm"
      >
        {editor.isOpen && (
          <TestimonialForm
            key={editor.selected?._id || 'new'}
            testimonial={editor.selected}
            onSaved={(saved, verb) => {
              setMessage(`${saved.name}'s review ${verb}.`);
              editor.close();
              testimonials.reload();
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default ManageTestimonials;
