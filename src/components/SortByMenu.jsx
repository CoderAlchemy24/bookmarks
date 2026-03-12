import { useEffect, useRef, useState } from 'react';
import '../assets/styles/SortByMenu.css'
import CheckDarkIcon from '../assets/images/icon-check-dark.svg'
import CheckLightIcon from '../assets/images/icon-check-light.svg'

export default function SortByMenu({ theme, currentSort = 'recentlyAdded', onSortChange, onClose }) {
  const isDark = theme === 'dark';
  const [lastClickedOption, setLastClickedOption] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const escHandler = (event) => {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
    };

    const outsideClickHandler = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        onClose && onClose();
      }
    };

    window.addEventListener('keydown', escHandler);
    document.addEventListener('mousedown', outsideClickHandler);

    return () => {
      window.removeEventListener('keydown', escHandler);
      document.removeEventListener('mousedown', outsideClickHandler);
    };
  }, [onClose]);

  const checkHandler = (option) => {
    if (lastClickedOption === option) {
      onClose && onClose();
      return;
    }

    if (onSortChange && option !== currentSort) {
      onSortChange(option);
    }

    setLastClickedOption(option);
  };

  return (
    <div className={`menu ${isDark ? 'dark' : 'light'}`} ref={menuRef}>
      <div className='item' onClick={() => checkHandler('recentlyAdded')}>
        <p>Recently added</p>
        {currentSort === 'recentlyAdded'
          ? (isDark ? <img src={CheckDarkIcon} alt="check-icon" /> : <img src={CheckLightIcon} alt="check-icon" />)
          : null}
      </div>
      <div className='item' onClick={() => checkHandler('recentlyVisited')}>
        <p>Recently Visited</p>
        {currentSort === 'recentlyVisited'
          ? (isDark ? <img src={CheckDarkIcon} alt="check-icon" /> : <img src={CheckLightIcon} alt="check-icon" />)
          : null}
      </div>
      <div className='item' onClick={() => checkHandler('mostVisited')}>
        <p>Most Visited</p>
        {currentSort === 'mostVisited'
          ? (isDark ? <img src={CheckDarkIcon} alt="check-icon" /> : <img src={CheckLightIcon} alt="check-icon" />)
          : null}
      </div>
    </div>
  );
}