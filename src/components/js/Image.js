import React from 'react';
import Img from 'react-image';
import ImageLoader from '../../assets/image-loading.gif';
import Fallback from '../../assets/fallback.png';

const Image = ({ url, title }) => {
  return (
    <Img
      src={[url, Fallback]}
      loader={
        <div className='image-loader'>
          <img src={ImageLoader} alt='loader icon' />
        </div>
      }
      alt={`${title} cover illustration`}
    />
  );
};

export default Image;
