import React from 'react';
import AuthDetails from '../../components/js/AuthDetails.js';

const SignIn = () => {
	return (
			<div className='auth-form'>
				<h2>Log in to your account</h2>
				<form className='signin-form'>
					<AuthDetails value='Login' />
				</form>
				<p className='auth-redirect'>
					<span>Don't have an account?</span>
					<a href='/signup'>Sign Up</a>
				</p>
			</div>
		)
}

export default SignIn;