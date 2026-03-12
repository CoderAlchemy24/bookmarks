import '../assets/styles/Main.css';
import { useMemo, useState } from 'react';
import IconSortByDark from '../assets/images/icon-sort-dark.svg';
import IconSortByLight from '../assets/images/icon-sort-light.svg';
import Card from '../components/Card';
import SortByMenu from '../components/SortByMenu';

export default function Main({ theme, 
       bookmarks = [], 
       selectedTags = [], 
       searchText = '', 
       mainView = 'Home',
       onArchiveToggle,
  onPinToggle,
  onEditBookmark,
  onDeleteBookmark }) {
   const isDark = theme === 'dark';
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [sortedBy, setSortedBy] = useState('mostVisited'); // 'recentlyAdded', 'recentlyVisited', 'mostVisited'

  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;

    // Filter by Home/Archived view
    if (mainView === 'Home') {
      result = result.filter((bookmark) => !bookmark.isArchived);
    } else if (mainView === 'Archived') {
      result = result.filter((bookmark) => bookmark.isArchived);
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      result = result.filter((bookmark) => {
        if (!Array.isArray(bookmark.tags)) return false;
        return bookmark.tags.some((tag) => selectedTags.includes(tag));
      });
    }

    // Filter by search text (case-insensitive title match)
    if (searchText.trim().length > 0) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter((bookmark) => {
        return bookmark.title?.toLowerCase().includes(lowerSearchText);
      });
      console.log('Search results:', result);
    }

    // Sort by selected option AND pinned status (pinned first)
    result = result.sort((a, b) => {
      // Pinned bookmarks always come first
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      // If both are pinned or both are unpinned, apply the selected sort
      if (sortedBy === 'recentlyAdded') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortedBy === 'recentlyVisited') {
        return new Date(b.lastVisited) - new Date(a.lastVisited);
      } else if (sortedBy === 'mostVisited') {
        return b.visitCount - a.visitCount;
      }
      return 0;
    });

    return result;
  }, [bookmarks, selectedTags, searchText, mainView, sortedBy]);

  const isMaxThree = (filteredBookmarks || []).length <= 3;

  const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

  return (
    <main className={`main ${theme} `}>
      <div className={`bookmarks-header ${theme}`}>
        <h2 className={`title ${theme}`}>Bookmarks Tagged</h2>
        <div className={`sort-by ${theme}`} onClick={toggleMenu}>
          <img src={isDark ? IconSortByDark : IconSortByLight} alt="sort-icon" className='sort-icon'/> 
          <span> Sort by</span>
        </div>
          {isMenuOpen && (
          <SortByMenu theme={theme} currentSort={sortedBy} onSortChange={setSortedBy} onClose={() => setIsMenuOpen(false)} />)}
        
      </div>
      <div className={`bookmarks-count ${theme} ${isMaxThree ? 'max-three' : ''}`}>
      {
                filteredBookmarks.map((bookmark) => (
                  <Card
                    bookmark={bookmark}
                    key={bookmark.id}
                    className="bookmark-card"
                    theme={theme}
                    onArchiveToggle={onArchiveToggle}
                    onPinToggle={onPinToggle}
                    onEditBookmark={onEditBookmark}
                    onDeleteBookmark={onDeleteBookmark}
                  />
        ))}
      
      </div>
    </main>)
  
}