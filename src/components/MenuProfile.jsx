import { useEffect, useRef } from 'react';
import '../assets/styles/MenuProfile.css';
import NavItem from '../components/NavItem';
import ThemeIconLight from '../assets/images/icon-theme-light.svg';
import ThemeIconDark from '../assets/images/icon-theme-dark.svg';
import LogoutIconLight from '../assets/images/icon-logout-light.svg';
import LogoutIconDark from '../assets/images/icon-logout-dark.svg';
import Avatar from '../assets/images/image-avatar.webp'


export default function MenuProfile({theme, setTheme, onClose}){
  const isDark = theme === 'dark';
  const menuRef = useRef(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
    };

    const handleOutsideClick = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        onClose && onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

    return(
        <div className={`menuProfile ${theme}`} ref={menuRef}>
          <div className={`user ${theme} `}>
            <img src={Avatar} alt="user-image" className='user-image'/>
            <div className={`user-details ${theme}`}>
                <p className="name">Emily Carter</p>
                <p className="email">emily101@gmail.com</p>
            </div>
          </div>
          <div className='navitem-wrapper-with-toggle'>
            <NavItem label="Theme" theme={theme} iconSrc={isDark? ThemeIconDark : ThemeIconLight} toggle={true} setTheme={setTheme} onToggle={() => onClose && onClose()} />
          </div>
          <div className='navitem-wrapper'>
            <NavItem label="Logout" theme={theme} iconSrc={isDark? LogoutIconDark : LogoutIconLight}/>
          </div>
        </div>
    )

}