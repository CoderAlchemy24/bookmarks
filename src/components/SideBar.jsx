import '../assets/styles/SideBar.css';
import { useMemo } from 'react';

import Logo from './Logo';
import NavItem from './NavItem';
import CheckBox from './CheckBox';
import Counter from './Counter';
import homeIconDark from '../assets/images/icon-home-dark.svg';
import homeIconLight from '../assets/images/icon-home-light.svg';
import archiveIconDark from '../assets/images/icon-archive-dark.svg';
import archiveIconLight from '../assets/images/icon-archive-light.svg';

export default function SideBar({ theme, mainView, setMainView, bookmarks = [], selectedTags = [], onSelectedTagsChange, isOpen = false, onClose }) {


   const isDark = theme === 'dark';

    const uniqueSortedTags = useMemo(() => {
        const allTags = bookmarks.flatMap((bookmark) => Array.isArray(bookmark.tags) ? bookmark.tags : []);
        return [...new Set(allTags)].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    }, [bookmarks]);

    const tagCount = useMemo(() => {
        const counts = {};
        bookmarks.forEach((bookmark) => {
            if (!Array.isArray(bookmark.tags)) return;
            bookmark.tags.forEach((tag) => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return counts;
    }, [bookmarks]);

    const handleCheckboxUpdate = (tag, newChecked) => {
        if (!onSelectedTagsChange) return;

        const nextSelectedTags = newChecked
            ? [...new Set([...selectedTags, tag])]
            : selectedTags.filter((selectedTag) => selectedTag !== tag);

        onSelectedTagsChange(nextSelectedTags);

        console.log('Checkbox state:', {
            tag,
            checked: newChecked,
        });
    };

     return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <div className={`sidebar ${theme} ${isOpen ? 'sidebar-open' : ''}`}>
            <Logo theme={theme} />
            <NavItem theme={theme} 
                iconSrc={isDark ? homeIconDark : homeIconLight} 
                label="Home" 
                isActive={mainView === 'Home'}
                onClick={() => setMainView('Home')}
                />
            <NavItem theme={theme} 
                iconSrc={isDark ? archiveIconDark : archiveIconLight} 
                label="Archived" 
                isActive={mainView === 'Archived'}
                onClick={() => setMainView('Archived')}
                />
            <span className="bookmarks-label">Tags</span>
            {
                uniqueSortedTags.map((tag) => (
                    <div key={tag} className="bookmark-item" theme={theme}>
                        
                        <CheckBox
                            id={`checkbox-${tag}`}
                            tag={tag}
                            className={`checkbox-${tag}`}
                            theme={theme}
                            checked={selectedTags.includes(tag)}
                            onChange={(newChecked) => handleCheckboxUpdate(tag, newChecked)}
                        />
                        
                        <Counter theme={theme} count={tagCount[tag] || 0} />
                    </div>
                ))
            }
            </div>
        </>
    );
}
