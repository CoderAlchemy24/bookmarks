import '../globals.css'
import '../assets/styles/Logo.css'

export default function Logo({theme}) {
  return (
    <div className={`logo ${theme}`}>
        {theme === 'dark' ? (
          <img src="./images/logo-dark-theme.svg" alt="Bookmark Manager Logo Dark" className="logo-image" />
        ) : (
          <img src="./images/logo-light-theme.svg" alt="Bookmark Manager Logo Light" className="logo-image" />
        )}
    </div>
  );
}
