import React from 'react';
import AuthDetails from '../../components/js/AuthDetails.js';

const SignUp = () => {
	return(
			<div className='auth-form'>
				<h2>Create your account</h2>
				<form className='signup-form'>
					<label htmlFor='username'>
						<p>Username</p>
						<input type='text' id='username' className='user-name' />
					</label>
					
					<AuthDetails value='Sign Up'/>
					
					<p className='auth-redirect'>
						<span>Already have an account?</span>
						<a href='/signin'>Log in now</a>
					</p>
				</form>
			</div>
		)
}

export default SignUp;