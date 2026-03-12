
import '../assets/styles/ButtonOnlyIcon.css'

export default function ButtonOnlyIcon({iconSrc, onClick, theme}) {
  
  return (
    <div className={`plus-icon ${theme}`} onClick={onClick} >
      <img src={iconSrc} alt="icon" width="20" height="20" />
      
    </div>
  );
}