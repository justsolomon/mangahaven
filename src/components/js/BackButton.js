import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../css/BackButton.css';

const BackButton = ({ toggleSearch }) => {
	return (
			<div className='back-button' onClick={toggleSearch}>
				<FontAwesomeIcon icon={faArrowLeft} />
			</div>
		)
}

export default BackButton;

// function() { window.history.back() }