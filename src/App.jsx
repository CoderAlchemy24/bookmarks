import { useState, useEffect } from 'react'
import Toast from './components/Toast';
import Header from './components/Header';
import './globals.css'
import './App.css'

import SideBar from './components/SideBar'
import Main from './components/Main'




function App() {

  const [bookmarks, setBookmarks] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [mainView, setMainView] = useState('Home'); // 'home' or 'archived'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [archiveToast, setArchiveToast] = useState({
    id: 0,
    visible: false,
    message: '',
    icon: 'archive',
  });
  const [editToast, setEditToast] = useState({
    id: 0,
    visible: false,
    message: '',
    icon: 'check',
  });
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored) return stored
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    } catch (e) {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
    } catch (e) {}
  }, [theme])

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(response => response.json())
      .then(data => {
        setBookmarks(data.bookmarks || []);
      })
      .catch(error => console.error('Error fetching bookmarks:', error));
  }, []);

  const patchBookmark = async (bookmarkId, updatedFields) => {
    const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      throw new Error(`Failed to update bookmark (${response.status})`);
    }

    const result = await response.json();
    return result.bookmark;
  };

  const handleArchiveToggle = async (bookmarkId) => {
    const targetBookmark = bookmarks.find((bookmark) => bookmark.id === bookmarkId);
    if (!targetBookmark) return;

    const nextArchived = !targetBookmark.isArchived;

    try {
      const updatedBookmark = await patchBookmark(bookmarkId, { isArchived: nextArchived });

      setBookmarks(prevBookmarks =>
        prevBookmarks.map(bookmark =>
          bookmark.id === bookmarkId ? { ...bookmark, ...updatedBookmark } : bookmark
        )
      );

      setArchiveToast({
        id: Date.now(),
        visible: true,
        message: nextArchived ? 'Bookmark archived.' : 'Bookmark unarchived.',
        icon: nextArchived ? 'archive' : 'unarchive',
      });
    } catch (error) {
      console.error('Archive toggle failed:', error);
      setArchiveToast({
        id: Date.now(),
        visible: true,
        message: 'Could not update archive status.',
        icon: 'close',
      });
      throw error;
    }
  };

  const handlePinToggle = async (bookmarkId) => {
    const targetBookmark = bookmarks.find((bookmark) => bookmark.id === bookmarkId);
    if (!targetBookmark) return;

    const nextPinned = !targetBookmark.pinned;
    const updatedBookmark = await patchBookmark(bookmarkId, { pinned: nextPinned });

    setBookmarks(prevBookmarks =>
      prevBookmarks.map(bookmark =>
        bookmark.id === bookmarkId ? { ...bookmark, ...updatedBookmark } : bookmark
      )
    );

    return updatedBookmark;
  };

  const handleEditBookmark = async (bookmarkId, updatedFields) => {
    try {
      const updatedBookmark = await patchBookmark(bookmarkId, updatedFields);

      setBookmarks(prevBookmarks =>
        prevBookmarks.map(bookmark =>
          bookmark.id === bookmarkId ? { ...bookmark, ...updatedBookmark } : bookmark
        )
      );

      setEditToast({
        id: Date.now(),
        visible: true,
        message: 'Bookmark updated successfully.',
        icon: 'check',
      });
    } catch (error) {
      console.error('Edit save failed:', error);
      setEditToast({
        id: Date.now(),
        visible: true,
        message: 'Could not save bookmark changes.',
        icon: 'close',
      });
      throw error;
    }
  };

  const handleAddBookmark = async (bookmarkInput) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmarkInput),
      });

      if (!response.ok) {
        throw new Error(`Failed to create bookmark (${response.status})`);
      }

      const result = await response.json();
      const createdBookmark = result.bookmark;

      setBookmarks(prevBookmarks => [createdBookmark, ...prevBookmarks]);
      setEditToast({
        id: Date.now(),
        visible: true,
        message: 'Bookmark added successfully.',
        icon: 'check',
      });

      return createdBookmark;
    } catch (error) {
      console.error('Add bookmark failed:', error);
      setEditToast({
        id: Date.now(),
        visible: true,
        message: 'Could not add bookmark.',
        icon: 'close',
      });
      throw error;
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete bookmark (${response.status})`);
      }

      setBookmarks(prevBookmarks =>
        prevBookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
      );

      setEditToast({
        id: Date.now(),
        visible: true,
        message: 'Bookmark deleted.',
        icon: 'close',
      });
    } catch (error) {
      console.error('Delete bookmark failed:', error);
      setEditToast({
        id: Date.now(),
        visible: true,
        message: 'Could not delete bookmark.',
        icon: 'close',
      });
      throw error;
    }
  };

  return (
   
    

    <div className={`main-container ${theme}`}>
      
      <SideBar
        theme={theme}
        setTheme={setTheme}
        bookmarks={bookmarks}
        selectedTags={selectedTags}
        onSelectedTagsChange={setSelectedTags}
        mainView={mainView}
        setMainView={setMainView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      
       />
      <div className={`content-area ${theme}`}>
        <Toast
          key={archiveToast.id}
          visible={archiveToast.visible}
          onClose={() => setArchiveToast(prev => ({ ...prev, visible: false }))}
          theme={theme}
          message={archiveToast.message}
          icon={archiveToast.icon}
        />
        <Toast
          key={editToast.id}
          visible={editToast.visible}
          onClose={() => setEditToast(prev => ({ ...prev, visible: false }))}
          theme={theme}
          message={editToast.message}
          icon={editToast.icon}
        />
         <Header
            theme={theme}
            setTheme={setTheme}
            searchText={searchText}
            onSearchChange={setSearchText}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onAddBookmark={handleAddBookmark}
         />
         <Main
          theme={theme}
          bookmarks={bookmarks}
          selectedTags={selectedTags}
          searchText={searchText}
          mainView={mainView}
          onArchiveToggle={handleArchiveToggle}
          onPinToggle={handlePinToggle}
           onEditBookmark={handleEditBookmark}
           onDeleteBookmark={handleDeleteBookmark}
         />
      </div>
   
     
    </div>
  )
}

export default App;
