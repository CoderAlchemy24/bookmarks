import '../assets/styles/BookmarkFormModal.css';
import { useEffect, useRef, useState } from 'react';
import CloseIconDark from '../assets/images/icon-close-dark.svg'
import CloseIconLight from '../assets/images/icon-close-light.svg'
import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';
import ButtonPrimary from '../components/ButtonPrimary';
import ButtonSecondary from '../components/ButtonSecondary';

export default function EditBookmark({ bookmark, theme, visible = false, onClose, onSave }) {
    const modalRef = useRef(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [tagsText, setTagsText] = useState('');
    const [error, setError] = useState('');
    
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!bookmark) return;
        setTitle(bookmark.title ?? '');
        setDescription(bookmark.description ?? '');
        setUrl(bookmark.url ?? '');
        setTagsText(Array.isArray(bookmark.tags) ? bookmark.tags.join(', ') : '');
        setError('');

        if (visible && modalRef.current) {
            modalRef.current.scrollTop = 0;
        }
    }, [bookmark, visible]);

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        const trimmedUrl = url.trim();
        const parsedTags = tagsText
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);

        if (!trimmedTitle) {
            setError('Title is required.');
            return;
        }

        if (!trimmedUrl) {
            setError('Website URL is required.');
            return;
        }

        if (parsedTags.length === 0) {
            setError('Add at least one tag.');
            return;
        }

        setError('');

        if (onSave) {
            await onSave(bookmark.id, {
                title: trimmedTitle,
                description: description.trim(),
                url: trimmedUrl,
                tags: parsedTags,
            });
        }
        onClose();
    };
    
    if (!visible) return null;

    return (
        <div className={`edit-bookmark-overlay`} onClick={onClose}>
                
            <div className={`edit-bookmark ${theme} visible`} onClick={e => e.stopPropagation()} ref={modalRef}>
              <div className='header'>
               <h2 className="edit-bookmark-title">Edit bookmark</h2>
                  {isDark ? <img src={CloseIconDark} alt="close-icon" className='x-icon' onClick={onClose}/>
                    : <img src={CloseIconLight} width="24px" height= "24px" alt="close-icon" className='x-icon' onClick={onClose}/> }
             
               </div>
                <p className="edit-bookmark-description">Save a link with details to keep your collection organized. 
                    We extract the favicon automatically from the URL.</p>
                <InputField 
                    label="Title *" 
                    placeholderText ="" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    hintText="Enter a title for your bookmark." 
                    darkMode={theme === 'dark'}
                />
                <TextAreaField
                    label="Description"
                    placeholderText=""
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    hintText="Add a description to your bookmark"
                    darkMode={theme === 'dark'}
                />  
                <InputField 
                    label="Website URL *" 
                    placeholderText ="https://example.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    hintText="This is a hint to help user." 
                    darkMode={theme === 'dark'}
                />
                <InputField 
                    label="Tags *" 
                    placeholderText ="" 
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    hintText="Enter tags separated by commas" 
                    darkMode={theme === 'dark'}
                />
                {error && <p>{error}</p>}
                <div className='btns'>
                    <ButtonSecondary label="Cancel" onClick={onClose} />
                    <ButtonPrimary caption="Save" onClick={handleSave} />
                </div>
            </div>
        </div>
    )
}