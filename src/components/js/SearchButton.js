import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/SearchButton.css';

const SearchButton = ({ toggleSearch }) => {
  return (
    <div className='search-button' onClick={toggleSearch}>
      <FontAwesomeIcon icon={faSearch} />
    </div>
  );
};

export default SearchButton;
