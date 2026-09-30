import { useState } from 'react';
import { Plus } from 'lucide-react';
import SEO from '../../../components/common/SEO/SEO';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Modal from '../../../components/common/Modal/Modal';
import AdminPageHeader from '../../../components/admin/AdminPageHeader/AdminPageHeader';
import AdminState from '../../../components/admin/AdminState/AdminState';
import ConfirmButton from '../../../components/admin/ConfirmButton/ConfirmButton';
import OfferForm from '../../../components/admin/OfferForm/OfferForm';
import Switch from '../../../components/admin/Switch/Switch';
import useAdminData from '../../../hooks/useAdminData';
import useSelection from '../../../hooks/useSelection';
import { deleteOffer, getAllOffers, updateOffer } from '../../../services/adminService';
import { formatShortDate } from '../../../utils/formatDate';
import styles from '../adminPage.module.css';
import local from './ManageOffers.module.css';

function offerState(offer) {
  if (new Date(offer.validTill) < new Date()) return 'Expired';
  return offer.isActive ? 'Live on the website' : 'Hidden';
}

function ManageOffers() {
  const offers = useAdminData(getAllOffers);
  const editor = useSelection();
  const [message, setMessage] = useState('');

  const toggle = async (offer, isActive) => {
    try {
      const updated = await updateOffer(offer._id, { isActive });
      offers.setData((list) => list.map((o) => (o._id === updated._id ? updated : o)));
      setMessage(`${offer.title} is now ${isActive ? 'shown' : 'hidden'}.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <SEO noIndex title="Offers" />
      <AdminPageHeader
        title="Offers"
        description="Active offers appear on the home page until their end date."
        actions={
          <Button size="sm" icon={Plus} onClick={() => editor.open(null)}>
            New offer
          </Button>
        }
      />
      <p className={styles.status} role="status">
        {message}
      </p>

      <AdminState data={offers.data} error={offers.error} onRetry={offers.reload}>
        {offers.data?.length ? (
          <ul className={styles.cards}>
            {offers.data.map((offer) => (
              <li key={offer._id} className={local.card}>
                <div className={local.media}>
                  {offer.image && <img src={offer.image} alt="" width={640} height={360} />}
                  {offer.discountText && <span className={local.label}>{offer.discountText}</span>}
                </div>
                <div className={local.body}>
                  <h2 className={local.title}>{offer.title}</h2>
                  <p className={styles.muted}>{offer.description}</p>
                  <p className={local.meta}>
                    {offerState(offer)}, until {formatShortDate(offer.validTill)}
                  </p>
                  <div className={local.actions}>
                    <Switch
                      checked={offer.isActive}
                      onChange={(v) => toggle(offer, v)}
                      label={`Show ${offer.title}`}
                    />
                    <span className={local.spacer} />
                    <button type="button" className={local.edit} onClick={() => editor.open(offer)}>
                      Edit<span className="visually-hidden"> {offer.title}</span>
                    </button>
                    <ConfirmButton
                      itemName={offer.title}
                      onConfirm={async () => {
                        try {
                          await deleteOffer(offer._id);
                          setMessage(`${offer.title} deleted.`);
                          offers.reload();
                        } catch (error) {
                          setMessage(error.message);
                        }
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No offers yet." text="Create one to feature it on the home page." />
        )}
      </AdminState>

      <Modal open={editor.isOpen} onClose={editor.close} labelledBy="offer-form-title" size="sm">
        {editor.isOpen && (
          <OfferForm
            key={editor.selected?._id || 'new'}
            offer={editor.selected}
            onSaved={(saved, verb) => {
              setMessage(`${saved.title} ${verb}.`);
              editor.close();
              offers.reload();
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default ManageOffers;
