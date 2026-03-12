import { useEffect, useRef, useState } from 'react';
import '../assets/styles/ToggleButton.css';
import SunIconDark from '../assets/images/icon-dark-theme-sun.svg';
import MoonIconDark from '../assets/images/icon-dark-theme-moon.svg';
import SunIconLight from '../assets/images/icon-light-theme-sun.svg';
import MoonIconLight from '../assets/images/icon-light-theme-moon.svg';

const SLIDE_ANIMATION_MS = 220;

export default function ToggleButton({ theme, setTheme, onToggle }) {
  const isDarkMode = theme === 'dark';
  const [animationClass, setAnimationClass] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleTheme = (event) => {
    event.stopPropagation();
    if (animationClass) return;

    const nextTheme = isDarkMode ? 'light' : 'dark';
    const nextAnimationClass = nextTheme === 'dark' ? 'anim-to-dark' : 'anim-to-light';

    setAnimationClass(nextAnimationClass);

    timeoutRef.current = setTimeout(() => {
      setTheme(nextTheme);
      setAnimationClass('');
      onToggle && onToggle();
    }, SLIDE_ANIMATION_MS);
  };

  return (
    <button
      type="button"
      className={`toggle-button ${isDarkMode ? 'dark' : 'light'} ${animationClass}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={isDarkMode}
    >
      <span className="toggle-slider" />
      <span className="toggle-icon toggle-icon-left">
        <img src={isDarkMode ? SunIconDark : SunIconLight} alt="Sun Icon" />
      </span>
      <span className="toggle-icon toggle-icon-right">
        <img src={isDarkMode ? MoonIconDark : MoonIconLight} alt="Moon Icon" />
      </span>
    </button>
  );
}