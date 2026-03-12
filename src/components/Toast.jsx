// src/components/Toast.jsx
import { useEffect } from 'react';
import '../assets/styles/Toast.css';
import iconCheckDark from '../assets/images/icon-check-dark.svg';
import iconCheckLight from '../assets/images/icon-check-light.svg';
import iconCloseDark from '../assets/images/icon-close-dark.svg';
import iconCloseLight from '../assets/images/icon-close-light.svg';
import iconCopyDark from '../assets/images/icon-copy-dark.svg';
import iconCopyLight from '../assets/images/icon-copy-light.svg';
import iconPinDark from '../assets/images/icon-pin-dark.svg';
import iconPinLight from '../assets/images/icon-pin-light.svg';
import iconUnpinDark from '../assets/images/icon-unpin-dark.svg';
import iconUnpinLight from '../assets/images/icon-unpin-light.svg';
import iconArchiveDark from '../assets/images/icon-archive-dark.svg';
import iconArchiveLight from '../assets/images/icon-archive-light.svg';
import iconUnarchiveDark from '../assets/images/icon-unarchive-dark.svg';
import iconUnarchiveLight from '../assets/images/icon-unarchive-light.svg'; 


export default function Toast({
  theme,
  message,
  icon,
  visible,
  onClose,
  duration = 5000,
}) {
  const checkIcon = theme === 'dark' ? iconCheckDark : iconCheckLight;
  const closeIcon = theme === 'dark' ? iconCloseDark : iconCloseLight;
  const copyIcon = theme === 'dark' ? iconCopyDark : iconCopyLight;
  const pinIcon = theme === 'dark' ? iconPinDark : iconPinLight;
  const unpinIcon = theme === 'dark' ? iconUnpinDark : iconUnpinLight;
  const archiveIcon = theme === 'dark' ? iconArchiveDark : iconArchiveLight;
  const unarchiveIcon = theme === 'dark' ? iconUnarchiveDark : iconUnarchiveLight;

  useEffect(() => {
    if (!visible) return;
    const timerId = setTimeout(onClose, duration);
    return () => clearTimeout(timerId);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const mainIcon =
    icon === 'check' ? checkIcon : icon === 'copy' ? copyIcon : icon === 'pin' ? pinIcon : icon === 'unpin' ? unpinIcon : icon === 'archive' ? archiveIcon : icon === 'unarchive' ? unarchiveIcon : closeIcon;

  return (
    <div className={`toast ${theme}`} role="status" aria-live="polite">
      <img src={mainIcon} alt="" className="toast-icon" aria-hidden="true" />
      <p>{message}</p>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
      <img src={closeIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  );
}