import React from 'react';
import '../css/ErrorMessage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

const ErrorMessage = ({ renderList }) => {
  return (
    <div className='error-div'>
      <div className='error-div-inner'>
        <p className='error-message'>
          An error occurred while loading. Please check your internet connection
          and try again
        </p>
        <button className='reload-button' onClick={renderList}>
          <FontAwesomeIcon icon={faRedo} />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
