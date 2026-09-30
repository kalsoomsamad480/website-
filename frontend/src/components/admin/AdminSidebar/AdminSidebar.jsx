import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  Coffee,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  ReceiptText,
  Tag,
} from 'lucide-react';
import Logo from '../../common/Logo/Logo';
import styles from './AdminSidebar.module.css';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ReceiptText },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarDays },
  { to: '/admin/menu', label: 'Menu', icon: Coffee },
  { to: '/admin/offers', label: 'Offers', icon: Tag },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
];

function AdminSidebar({ user, onNavigate, onSignOut }) {
  return (
    <div className={`${styles.sidebar} on-dark`}>
      <div className={styles.brand}>
        <Logo tone="light" onClick={onNavigate} />
        <span className={styles.badge}>Admin</span>
      </div>

      <nav aria-label="Admin">
        <ul className={styles.links}>
          {ADMIN_LINKS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <p className={styles.user}>
          Signed in as <strong>{user.name}</strong>
        </p>
        <a href="/" className={styles.footerLink}>
          <ExternalLink size={16} aria-hidden="true" />
          View website
        </a>
        <button type="button" className={styles.footerLink} onClick={onSignOut}>
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
