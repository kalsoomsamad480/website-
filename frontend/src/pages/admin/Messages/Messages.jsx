import { useState } from 'react';
import { Mail, RotateCw } from 'lucide-react';
import SEO from '../../../components/common/SEO/SEO';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import AdminPageHeader from '../../../components/admin/AdminPageHeader/AdminPageHeader';
import AdminState from '../../../components/admin/AdminState/AdminState';
import ConfirmButton from '../../../components/admin/ConfirmButton/ConfirmButton';
import FilterChips from '../../../components/admin/FilterChips/FilterChips';
import useAdminData from '../../../hooks/useAdminData';
import { deleteMessage, getMessages, setMessageRead } from '../../../services/adminService';
import { formatDateTime } from '../../../utils/formatDate';
import styles from '../adminPage.module.css';
import local from './Messages.module.css';

function Messages() {
  const messages = useAdminData(getMessages);
  const [filter, setFilter] = useState('unread');
  const [status, setStatus] = useState('');

  const all = messages.data || [];
  const unread = all.filter((m) => !m.isRead).length;
  const visible = filter === 'unread' ? all.filter((m) => !m.isRead) : all;

  const markRead = async (message, isRead) => {
    try {
      const updated = await setMessageRead(message._id, isRead);
      messages.setData((list) => list.map((m) => (m._id === updated._id ? updated : m)));
      setStatus(`Marked as ${isRead ? 'read' : 'unread'}.`);
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <>
      <SEO noIndex title="Messages" />
      <AdminPageHeader
        title="Messages"
        description="Notes sent from the contact form."
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCw}
            onClick={messages.reload}
            disabled={messages.loading}
          >
            Refresh
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <FilterChips
          options={[
            { value: 'unread', label: 'Unread', count: unread },
            { value: 'all', label: 'All', count: all.length },
          ]}
          value={filter}
          onChange={setFilter}
          label="Filter messages"
        />
      </div>
      <p className={styles.status} role="status">
        {status}
      </p>

      <AdminState data={messages.data} error={messages.error} onRetry={messages.reload}>
        {visible.length ? (
          <ul className={local.list}>
            {visible.map((message) => (
              <li
                key={message._id}
                className={`${local.card} ${message.isRead ? '' : local.unread}`}
              >
                <div className={local.head}>
                  <div>
                    <p className={local.from}>
                      {message.name} <span className={local.email}>{message.email}</span>
                    </p>
                    <p className={local.date}>{formatDateTime(message.createdAt)}</p>
                  </div>
                  {!message.isRead && <span className={local.badge}>New</span>}
                </div>
                {message.subject && <p className={local.subject}>{message.subject}</p>}
                <p className={local.body}>{message.message}</p>
                <div className={local.actions}>
                  <a
                    className={local.reply}
                    href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || 'Your message to Alladin Cafe'}`)}`}
                  >
                    <Mail size={16} aria-hidden="true" /> Reply
                  </a>
                  <button
                    type="button"
                    className={local.link}
                    onClick={() => markRead(message, !message.isRead)}
                  >
                    Mark as {message.isRead ? 'unread' : 'read'}
                  </button>
                  <ConfirmButton
                    itemName={`message from ${message.name}`}
                    onConfirm={async () => {
                      try {
                        await deleteMessage(message._id);
                        messages.setData((list) => list.filter((m) => m._id !== message._id));
                        setStatus('Message deleted.');
                      } catch (error) {
                        setStatus(error.message);
                      }
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title={filter === 'unread' ? 'You are all caught up.' : 'No messages yet.'}
            text="New messages from the contact page will appear here."
          />
        )}
      </AdminState>
    </>
  );
}

export default Messages;
