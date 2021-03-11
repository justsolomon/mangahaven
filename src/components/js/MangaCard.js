import React from 'react';
import '../css/MangaCard.css';
import Image from './Image.js';
import LazyLoad from 'react-lazyload';
import { useHistory } from 'react-router-dom';

const MangaCard = ({ imageUrl, mangaTitle, alias }) => {
  const history = useHistory();
  return (
    <LazyLoad
      once={true}
      placeholder={<div className='manga-card loading'></div>}
      height={100}
      offset={[-50, 50]}
    >
      <div
        className='manga-card'
        onClick={function () {
          history.push(`/manga/${alias}`);
        }}
      >
        <Image url={imageUrl} title={mangaTitle} />
        <div className='container'>
          <p className='manga-title'>{mangaTitle}</p>
        </div>
      </div>
    </LazyLoad>
  );
};

export default MangaCard;
