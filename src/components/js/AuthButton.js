import React from 'react';
import '../css/AuthButton.css';

const AuthButton = ({ value }) => {
	return (
			<button className='auth-button'>{value}</button>
		)
}

export default AuthButton;