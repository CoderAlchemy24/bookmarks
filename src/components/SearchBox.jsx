import '../assets/styles/SearchBox.css';
import searchIconDark from '../assets/images/icon-search-dark.svg';
import searchIconLight from '../assets/images/icon-search-light.svg';

export default function SearchBox({ theme, searchText = '', onSearchChange }){
   const isDark = theme === 'dark';
   
   const handleChange = (e) => {
      const value = e.target.value;
      if (onSearchChange) {
         onSearchChange(value);
      }
      console.log('Search input:', value);
   };

   return (
      <div className={`search-box ${theme}`}>
          <img src={isDark ? searchIconDark : searchIconLight} alt="search icon" className='search-icon' />
          
          <input
             type="search"
             id="search-input"
             placeholder="Search..."
             className='search-input'
             value={searchText}
             onChange={handleChange}
          />
          <label htmlFor="search-input" className='search-label'></label>
      </div>
   )
}