import { Link } from 'react-router-dom';
import styles from './Button.module.css';

/**
 * Renders a router Link (`to`), an anchor (`href`), or a button.
 * Variants: primary, accent, ghost, onDark, ghostLight.
 */
function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  fullWidth = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span>{children}</span>
      {Icon && <Icon className={styles.icon} size={18} strokeWidth={2.2} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}

export default Button;
