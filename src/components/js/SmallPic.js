import React from 'react';
import Pic from '../../assets/pic.jpg';
import '../css/SmallPic.css';

const SmallPic = () => {
  return (
    <div className='small-profile-pic'>
      <img src={Pic} alt='user profile pic' />
    </div>
  );
};

export default SmallPic;
