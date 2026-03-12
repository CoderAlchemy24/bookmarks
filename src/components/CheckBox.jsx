import '../assets/styles/CheckBox.css';

import { useState, useEffect } from 'react';


const getTheme = (theme) => {
	if (theme === 'dark' || theme === 'light') return theme;
	if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) return 'dark';
	return 'light';
};


export default function CheckBox({ id, tag, theme, checked = false, onChange }) {
	const resolvedTheme = getTheme(theme);
	
	// internal state so the checkbox updates visually on click
	const [internalChecked, setInternalChecked] = useState(Boolean(checked));

	// state class must reflect internal state (not the prop directly)
	const stateClass = `${internalChecked ? 'checked' : 'unchecked'}`;

	// keep internal state in sync when parent controls `checked`
	useEffect(() => {
		if (typeof checked === 'boolean') setInternalChecked(checked);
	}, [checked]);


	function handleChange(e) {
		const newChecked = e.target.checked;
		setInternalChecked(newChecked);
		if (onChange) {
			onChange(newChecked, e);
		}
	}

	return (
		<label>
		<input
		    id={id}
            tag={tag}
			type="checkbox"
			className={`checkbox ${resolvedTheme}-${stateClass}`}
			checked={internalChecked}
			onChange={handleChange}
		/>{tag}
		</label>
	);
}