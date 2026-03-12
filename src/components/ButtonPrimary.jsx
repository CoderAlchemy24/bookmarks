import '../globals.css'
import '../assets/styles/PrimaryButton.css'

export default function ButtonPrimary({caption, theme, onClick, error}) {
  const className = `button-primary ${error ? 'error' : ''}`;

  return (
    <button className={className} onClick={onClick}>
      {caption}
    </button>
  );
}
