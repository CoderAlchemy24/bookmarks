import '../assets/styles/Header.css';
import SearchBox from '../components/SearchBox';
import ButtonOnlyIcon from '../components/ButtonOnlyIcon';
import ButtonPrimary from '../components/ButtonPrimary';
import AddBookmark from '../components/AddBookmark';
import avatarImage from '../assets/images/image-avatar.webp';
import MenuProfile from '../components/MenuProfile';
import hamburgerIconLight from '../assets/images/icon-menu-hamburger-light.svg';
import hamburgerIconDark from '../assets/images/icon-menu-hamburger-dark.svg';
import iconAddDark from '../assets/images/icon-add-dark.svg';
import iconAddLight from '../assets/images/icon-add-light.svg';
import { useState } from 'react';

export default function Header({theme, setTheme, searchText = '', onSearchChange, onMenuClick, onAddBookmark}) {

     const [modalVisible, setModalVisible] = useState(false);
     const [profilMenuVisibility, setProfilMenuVisibility] = useState(false);

     const openAddModal = () => setModalVisible(true);
     const closeAddModal = () => setModalVisible(false);

     const handleAddSave = async (bookmarkInput) => {
       if (!onAddBookmark) return;
       await onAddBookmark(bookmarkInput);
     };
     
     return  (
      <div className={`header ${theme}`}>
            
        <div className='header-left'>
           <img 
             src={theme === 'light' ? hamburgerIconLight : hamburgerIconDark} 
             alt="hamburger" 
             className='hamburger' 
             onClick={onMenuClick}
             
           />
           <SearchBox
              theme={theme}
              searchText={searchText}
              onSearchChange={onSearchChange}
           />
        </div>
        <div className='header-right'>
          <ButtonOnlyIcon theme={theme} iconSrc={theme === 'dark' ? iconAddDark : iconAddLight} onClick={openAddModal} />
          <ButtonPrimary theme={theme} caption=" + Add Bookmark" onClick={openAddModal}   />
          <AddBookmark theme={theme} visible={modalVisible} onClose={closeAddModal} onSave={handleAddSave} />
         <img src={avatarImage} alt="avatar" className='avatar' onClick={()=>{setProfilMenuVisibility((prev) => !prev)}}/>
            
        
        </div>
        {profilMenuVisibility &&<div className='menu-profile-container'>
          <MenuProfile theme={theme} setTheme={setTheme} onClose={() => setProfilMenuVisibility(false)} />
        </div>}
      </div>
   
   )

}