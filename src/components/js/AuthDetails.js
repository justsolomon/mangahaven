import React from 'react';
import AuthButton from './AuthButton.js';

const AuthDetails = ({ value }) => {
	return (
			<div className='auth-details'>
				<label htmlFor='email'>
					<p>Email Address</p>
					<input type='email' id='email' className='email-input' />
				</label>
				<label htmlFor='password'>
					<p>Password</p>
					<input type='password' id='password' className='password-input' />
				</label>
				<label htmlFor='submit'>
					<AuthButton value={value} />
				</label>
			</div>
		)
}

export default AuthDetails;