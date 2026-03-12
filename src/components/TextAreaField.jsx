import '../globals.css'
import '../assets/styles/TextAreaField.css';
import { useState, useEffect } from 'react';

export default function TextAreaField({label, icon, placeholderText, value, onChange, hintText, darkMode, error}) {
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

  const length = (value !== undefined) ? value.length : internalValue.length;
  const counter = `${length}/280`;

  return (
    <div className={`text-area-field ${isDark ? 'dark' : 'light'}`}>
      <label htmlFor="textarea-input" className={`textarea-label ${isDark ? 'dark' : 'light'}`}>
        {label}
      </label>
            <div className="textarea-wrapper">
                {icon && <img src={icon} alt="search-icon" className="textarea-icon" />}
                <textarea className={`textarea-input ${isDark ? 'dark' : 'light'}`}
                    placeholder={placeholderText}
                   
                    value={internalValue}
                    maxLength="280"
                    onChange={handleChange}
                />
            </div>
            
        
        <div className="bottom-texts">
        {hintText && <div className="hint-and-counter">  
           <p className={`${isDark ? 'dark' : 'light'} `}>{hintText}</p>
           <p className={`${isDark ? 'dark' : 'light'} `}>{counter}</p>
          </div>}
       </div>
    </div>
  );
}