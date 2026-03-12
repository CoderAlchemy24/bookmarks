import '../assets/styles/DialogArchive.css';
import CloseIconDark from '../assets/images/icon-close-dark.svg'
import CloseIconLight from '../assets/images/icon-close-light.svg'
import ButtonPrimary from '../components/ButtonPrimary';
import ButtonSecondary from '../components/ButtonSecondary';

export default function DialogDelete({ theme, isOpen, onClose }) {
    const isDark = theme === 'dark';
    
    return (
        <div className={`dialog-delete ${theme} ${isOpen ? 'open' : ''}`}>
           {isDark ? <img src={CloseIconDark} alt="close-icon" className='x-icon' onClick={onClose}/>
                   : <img src={CloseIconLight} alt="close-icon" className='x-icon' onClick={onClose}/> }
            <div className={`dialog-content ${theme}`}>
                <h2>Delete Bookmark</h2>
                <p >Are you sure you want to delete this bookmark?</p>
                <div className="btns">
                    <ButtonSecondary theme={theme} label="Cancel" onClick={onClose} />
                    <button theme={theme} className='delete-button' onClick={onClose} >Delete Permanently</button>
                </div>
            </div>
        </div>
    )
}