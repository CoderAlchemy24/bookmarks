import '../assets/styles/Card.css';
import DropDownMenu from './DropDownMenu';
import EditBookmark from './EditBookmark';
import Toast from './Toast';
import { useState } from 'react';   
import { copyToClipboard } from './CardUtils';

export default function Card({ theme, bookmark, onArchiveToggle, onPinToggle, onEditBookmark, onDeleteBookmark }) {
 
  const fallbackFavicon = '../assets/images/favicon-32x32.png';
  const faviconName = (bookmark.favicon || fallbackFavicon).split('/').pop();
    const faviconSrc = new URL(`../assets/images/${faviconName}`, import.meta.url).href;
    const menuIconSrc = new URL(`../assets/images/icon-menu-bookmark-${theme === 'dark' ? 'dark' : 'light'}.svg`, import.meta.url).href;
    const counterIconSrc = new URL(`../assets/images/icon-visit-count-${theme === 'dark' ? 'dark' : 'light'}.svg`, import.meta.url).href;
    const lastVisitIconSrc = new URL(`../assets/images/icon-last-visited-${theme === 'dark' ? 'dark' : 'light'}.svg`, import.meta.url).href;
    const iconCreatedSrc = new URL(`../assets/images/icon-created-${theme === 'dark' ? 'dark' : 'light'}.svg`, import.meta.url).href;
    const pinIconSrc = new URL(`../assets/images/icon-pin-${theme === 'dark' ? 'dark' : 'light'}.svg`, import.meta.url).href;
    const unpinIconSrc = new URL(`../assets/images/icon-unpin-${theme === 'dark' ? 'dark' : 'light'}.svg`, import.meta.url).href;


    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const [pinToastVisible, setPinToastVisible] = useState(false);
    const [pinToastMessage, setPinToastMessage] = useState('');
    const [pinToastIcon, setPinToastIcon] = useState('pin');


    const formatDayMonth = iso => {
      if (!iso) return '';
      const d = new Date(iso);
      return d.toLocaleString('en-GB', { day: 'numeric', month: 'short' }); 
    };

    const openPopupmenu = () => {
       setVisible(prev => !prev);
    }

    const handleCopy = async () => {
      if (!bookmark?.url) return;
      const ok = await copyToClipboard(bookmark.url);
    
      if (ok) {
        setCopied(true); // a Toast intézi az 5 mp-es eltűnést
      } else {
        console.log('Copying failed');
      }
      setVisible(false);
    };

    const handlePinToggle = async () => {
      if (onPinToggle) {
        try {
          const nextPinned = !bookmark.pinned;
          await onPinToggle(bookmark.id);
          setPinToastMessage(nextPinned ? 'Bookmark pinned to top!' : 'Bookmark unpinned.');
          setPinToastIcon(nextPinned ? 'pin' : 'unpin');
          setPinToastVisible(true);
        } catch (error) {
          console.error('Pin toggle failed:', error);
        }
      } else {
        console.log('Pin toggle failed');
      }
      setVisible(false);
    };

    const handleEditSave = async (bookmarkId, updatedFields) => {
      if (!onEditBookmark) return;
      await onEditBookmark(bookmarkId, updatedFields);
    };


    return (
        <div className={`card ${theme}`}>
            <Toast
                visible={copied}
                onClose={() => setCopied(false)}
                theme={theme}
                message="Link copied to clipboard!"
                icon="copy"
              />
              <Toast
                visible={pinToastVisible}
                onClose={() => setPinToastVisible(false)}
                theme={theme}
                message={pinToastMessage}
                icon={pinToastIcon}
              />
              
            
            <div className="card-header">
                <img src={faviconSrc} alt={`favicon`} className="card-favicon" />

                <div className="card-header-texts">
                    <h2 className="card-title">{bookmark.title}</h2>
                    <h3 className="card-url">{bookmark.url}</h3>
                </div>
                     <img src={menuIconSrc} alt="menu icon" className="card-menu-icon" onClick={openPopupmenu}/>
                     <DropDownMenu theme={theme}
                            bookmark={bookmark}
                         visible={visible}
                         pinned={bookmark.pinned}
                         archive={bookmark.isArchived}
                            
                         onEdit={() => { setEditVisible(true); setVisible(false); }}
                         onArchiveToggle={onArchiveToggle}
                         onPinToggle={handlePinToggle}
                         onDelete={onDeleteBookmark}
                         onClose={() => setVisible(false)}
                         onCopy={handleCopy} />
                    <EditBookmark
                      bookmark={bookmark}
                      theme={theme}
                      visible={editVisible}
                      onClose={() => setEditVisible(false)}
                      onSave={handleEditSave}
                    />
            </div>

            <p className="card-description">{bookmark.description}</p>
            <div className="card-tags">
                {bookmark.tags.map((tag, index) => (
                    <span key={index} className={`card-tag ${theme}`}>{tag}</span>
                ))}
            </div>
            <div className="card-footer">
                <div className='footer-tag'>
                    <img src={counterIconSrc} alt="counter icon" />
                    <span className="card-visits">{bookmark.visitCount}</span>
                </div>
                <div className='footer-tag'>
                    <img src={iconCreatedSrc} alt="created icon" />
                    <span className="card-created">{formatDayMonth(bookmark.createdAt)}</span>
                </div>
                <div className='footer-tag'>
                    <img src={lastVisitIconSrc} alt="last visit icon" />
                    <span className="card-last-visit">{formatDayMonth(bookmark.lastVisited)}</span>
                </div>
                
                <div className="card-pin-indicator">
                    <img 
                        src={bookmark.pinned ? unpinIconSrc : pinIconSrc} 
                        alt={bookmark.pinned ? "unpinned" : "pinned"} 
                        className="card-pin-icon"
                        onClick={handlePinToggle}
                    />
                </div>
            </div>
        </div>
    );
}