import '../assets/styles/BookmarkFormModal.css';
import { useEffect, useRef, useState } from 'react';
import CloseIconDark from '../assets/images/icon-close-dark.svg'
import CloseIconLight from '../assets/images/icon-close-light.svg'
import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';
import ButtonPrimary from '../components/ButtonPrimary';
import ButtonSecondary from '../components/ButtonSecondary';

export default function AddBookmark({ theme, visible = false, onClose, onSave }) {
    const modalRef = useRef(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [tagsText, setTagsText] = useState('');
    const [error, setError] = useState('');
    
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!visible) return;
        if (modalRef.current) {
            modalRef.current.scrollTop = 0;
        }
    }, [visible]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setUrl('');
        setTagsText('');
        setError('');
    };

    const handleModalClose = () => {
        resetForm();
        onClose();
    };

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

        try {
            if (onSave) {
                await onSave({
                    title: trimmedTitle,
                    description: description.trim(),
                    url: trimmedUrl,
                    tags: parsedTags,
                });
            }

            handleModalClose();
        } catch (saveError) {
            setError('Could not save bookmark. Try again.');
        }
    };
    
    if (!visible) return null;

    return (
        <div className={`add-bookmark-overlay`} onClick={handleModalClose}>
                
            <div className={`add-bookmark ${theme} visible`} onClick={e => e.stopPropagation()} ref={modalRef}>
               <div className='header'>
               <h2 className="add-bookmark-title">Add a bookmark</h2>
                  {isDark ? <img src={CloseIconDark} alt="close-icon" className='x-icon' onClick={handleModalClose}/>
                    : <img src={CloseIconLight} width="24px" height= "24px" alt="close-icon" className='x-icon' onClick={handleModalClose}/> }
             
               </div>
                <p className="add-bookmark-description">Save a link with details to keep your collection organized. 
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
                    <ButtonSecondary label="Cancel" onClick={handleModalClose} />
                    <ButtonPrimary caption="Save" onClick={handleSave} />
                </div>
            </div>
        </div>
    )
}