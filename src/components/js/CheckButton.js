import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as regularCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircle as solidCircle } from '@fortawesome/free-solid-svg-icons';
import '../css/CheckButton.css';

const CheckButton = ({ classname, view }) => {
  return (
    <button className={`${classname}-button check-button`}>
      {view !== classname ? (
        <FontAwesomeIcon icon={regularCircle} />
      ) : (
        <FontAwesomeIcon icon={solidCircle} />
      )}
    </button>
  );
};

export default CheckButton;
