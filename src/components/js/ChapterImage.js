import React from 'react';
import Img from 'react-image';
import ImageLoader from '../../assets/image-loading.gif';

const ChapterImage = ({ url }) => {
  return (
    <Img
      src={url}
      loader={
        <div className='image-loader'>
          <img src={ImageLoader} alt='loader icon' />
        </div>
      }
      alt='chapter page'
    />
  );
};

export default ChapterImage;
