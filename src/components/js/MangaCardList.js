import React from 'react';
import '../css/MangaCardList.css';
import MangaCard from './MangaCard.js';

const MangaCardList = ({ mangaArray }) => {
  return (
    <div className='manga-list'>
      {mangaArray.map((manga, id) => {
        return (
          <MangaCard
            imageUrl={`https://cdn.mangaeden.com/mangasimg/${manga.im}`}
            key={id}
            mangaTitle={manga.t}
            id={manga.i}
            alias={manga.a}
          />
        );
      })}
    </div>
  );
};

export default MangaCardList;
