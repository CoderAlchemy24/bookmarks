import '../assets/styles/DropDownMenu.css';
import NavItem from './NavItem';
import VisitIconDark from '../assets/images/icon-visit-dark.svg';
import VisitIconLight from '../assets/images/icon-visit-light.svg';
import CopyIconDark from '../assets/images/icon-copy-dark.svg';
import CopyIconLight from '../assets/images/icon-copy-light.svg';
import PinIconDark from '../assets/images/icon-pin-dark.svg';
import PinIconLight from '../assets/images/icon-pin-light.svg';
import UnpinIconDark from '../assets/images/icon-unpin-dark.svg';
import UnpinIconLight from '../assets/images/icon-unpin-light.svg';
import EditIconDark from '../assets/images/icon-edit-dark.svg';
import EditIconLight from '../assets/images/icon-edit-light.svg';
import ArchiveIconDark from '../assets/images/icon-archive-dark.svg';
import ArchiveIconLight from '../assets/images/icon-archive-light.svg';
import UnarchiveIconDark from '../assets/images/icon-unarchive-dark.svg';
import UnarchiveIconLight from '../assets/images/icon-unarchive-light.svg';
import DeleteIconDark from '../assets/images/icon-delete-dark.svg';
import DeleteIconLight from '../assets/images/icon-delete-light.svg';


export default function DropDownMenu({ theme, pinned, archive, visible, bookmark, onEdit, onArchiveToggle, onPinToggle, onCopy, onDelete, onClose }) {
const isDark = theme === 'dark';
const isVisible = !!visible;

const handleArchive = async () => {
    try {
        if (onArchiveToggle) {
            await onArchiveToggle(bookmark.id);
        }
    } catch (error) {
        console.error('Archive action failed:', error);
    } finally {
        if (onClose) {
            onClose();
        }
    }
};

const handlePin = async () => {
    try {
        if (onPinToggle) {
            await onPinToggle(bookmark.id);
        }
    } catch (error) {
        console.error('Pin action failed:', error);
    } finally {
        if (onClose) {
            onClose();
        }
    }
};

const handleVisit = () => {
    if (onClose) {
        onClose();
    }
};

const handleCopy = () => {
    if (onCopy) {
        onCopy();
    }
    if (onClose) {
        onClose();
    }
};

const handleDelete = async () => {
    try {
        if (onDelete) {
            await onDelete(bookmark.id);
        }
    } catch (error) {
        console.error('Delete action failed:', error);
    } finally {
        if (onClose) {
            onClose();
        }
    }
};
  
   
        return (
                <div className={`dropdown-menu ${theme} ${isVisible ? 'visible' : ''} ${pinned ? 'pinned' : ''} ${archive ? 'archived' : ''}`}>
                    {isVisible && (
                        <>
                            <div className='navitem-wrapper'>
                                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" onClick={handleVisit}>
                                    <NavItem label="Visit" theme={theme} iconSrc={isDark ? VisitIconDark : VisitIconLight}/>
                                </a>
                            </div>
                            <div className='navitem-wrapper'>
                                <NavItem label="Copy" theme={theme} iconSrc={isDark ? CopyIconDark : CopyIconLight} onClick={handleCopy}/>
                            </div>
                            {pinned === false && (
                                <div className='navitem-wrapper'>
                                    <NavItem label="Pin" theme={theme} iconSrc={isDark ? PinIconDark : PinIconLight} onClick={handlePin} />
                                </div>
                            )}
                            {pinned === true && (
                                <div className='navitem-wrapper'>
                                    <NavItem label="Unpin" theme={theme} iconSrc={isDark ? UnpinIconDark : UnpinIconLight} onClick={handlePin} />
                                </div>
                            )}
                            <div className='navitem-wrapper'>
                                <NavItem label="Edit" 
                                         theme={theme} 
                                         iconSrc={isDark ? EditIconDark : EditIconLight}
                                         onClick={onEdit} />
                            </div>
                            {archive === false && (
                                <div className='navitem-wrapper'>
                                    <NavItem label="Archive" 
                                             theme={theme} 
                                             iconSrc={isDark ? ArchiveIconDark : ArchiveIconLight}
                                             onClick={handleArchive} />
                                </div>
                            )}
                            {archive === true && (
                                <div className='navitem-wrapper'>
                                    <NavItem label="Unarchive" 
                                             theme={theme} 
                                             iconSrc={isDark ? UnarchiveIconDark : UnarchiveIconLight}
                                             onClick={handleArchive} />
                                </div>
                            )}
                            <div className='navitem-wrapper'>
                                <NavItem
                                  label="Delete"
                                  theme={theme}
                                  iconSrc={isDark ? DeleteIconDark : DeleteIconLight}
                                  onClick={handleDelete}
                                />
                            </div>
                            {/* Edit modal is handled by the parent `Card` component via `onEdit` */}
                        </>
                    )}
                </div>
        )
    
}