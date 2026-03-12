import '../globals.css';
import '../assets/styles/NavItem.css';
import ToggleButton from './ToggleButton';

export default function NavItem({ label, theme, iconSrc, toggle=false, setTheme, onClick, onToggle }) {
  const isInteractive = typeof onClick === 'function' && !toggle;

  const handleKeyDown = (event) => {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`nav-item ${theme} ${toggle ? 'has-toggle' : ''}`}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {iconSrc && (
        <img src={iconSrc} alt={`nav-item-${label}-icon`} className="nav-item-icon" />
      )}
      <span className={`nav-item-label ${theme}`}>{label}</span>
      <span className='toggle' onClick={(event) => event.stopPropagation()}>
          {toggle && <ToggleButton theme={theme} setTheme={setTheme} onToggle={onToggle} />}
      </span>
    </div>
  );
}