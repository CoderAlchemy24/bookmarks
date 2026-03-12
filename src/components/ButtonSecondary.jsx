import '../globals.css'
import '../assets/styles/SecondaryButton.css'

export default function ButtonSecondary({label, onClick, theme, error}) {
  const className = `button-secondary ${theme ===  'dark' ? 'dark' : 'light'}`;

  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  );
}