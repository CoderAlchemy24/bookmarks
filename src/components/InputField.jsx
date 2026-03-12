import '../globals.css'
import '../assets/styles/InputField.css';
import { useState, useEffect } from 'react';

export default function TextAreaField({label, icon, placeholderText, value, onChange, hintText, darkMode}) {
 const [internalValue, setInternalValue] = useState(value ?? '');

  const isDark = (typeof darkMode === 'boolean')
    ? darkMode
    : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className={`input-field ${isDark ? 'dark' : 'light'}`}>
      <label htmlFor="input-field-input" className={`input-label ${isDark ? 'dark' : 'light'}`}>
        {label}
      </label>
            <div className="input-field-wrapper">
                {icon && <img src={icon} alt="search-icon" className="input-icon" />}
                <input type="text" id="input-field-input" className={`input-field-input ${isDark ? 'dark' : 'light'}`}
                    placeholder={placeholderText}
                    
                    value={internalValue}
                    maxLength="280"
                    onChange={handleChange}
                />
            </div>
            
        
        <div className="bottom-texts">
        {hintText && <div className="hint-and-counter">  
                 <p className={`${isDark ? 'dark' : 'light'} `}>{hintText}</p>
                 
                </div>}
       </div>
    </div>
  );
}