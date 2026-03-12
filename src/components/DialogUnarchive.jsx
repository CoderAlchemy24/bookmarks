import '../assets/styles/DialogArchive.css';
import CloseIconDark from '../assets/images/icon-close-dark.svg'
import CloseIconLight from '../assets/images/icon-close-light.svg'
import ButtonPrimary from '../components/ButtonPrimary';
import ButtonSecondary from '../components/ButtonSecondary';

export default function DialogUnarchive({ theme, isOpen, onClose }) {
    const isDark = theme === 'dark';
    
    return (
        <div className={`dialog-unarchive ${theme} ${isOpen ? 'open' : ''}`}>
           {isDark ? <img src={CloseIconDark} alt="close-icon" className='x-icon' onClick={onClose}/>
                   : <img src={CloseIconLight} alt="close-icon" className='x-icon' onClick={onClose}/> }
            <div className={`dialog-content ${theme}`}>
                <h2>Unarchive Bookmark</h2>
                <p >Move this bookmark back to your active list?</p>
                <div className="btns">
                    <ButtonSecondary theme={theme} label="Cancel" onClick={onClose} />
                    <ButtonPrimary theme={theme} caption="Unarchive" onClick={onClose} />
                </div>
            </div>
        </div>
    )
}