import React from 'react';
import Pic from '../../assets/fallback.png';
import BackButton from '../../components/js/BackButton.js';
import '../css/UserProfile.css';
import Loader from '../../components/js/Loader.js';

const UserProfile = () => {
	return (
		<div className='user-profile'>
			<BackButton />
			<div className='profile-pic'>
				<img src={Pic} alt='user profile pic' />
			</div>
			<div className='profile-info'>
				<p>Username: Solomon</p>
				<p>First Name: Gbolahan</p>
				<p>Last Name: Balogun</p>
			</div>
			<button className='edit-button'>Edit profile</button>
			<button className='history-button'>Exam History</button>
			<Loader />
		</div>
	)
}

export default UserProfile;