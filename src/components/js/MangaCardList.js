import React from 'react';
import '../css/MangaCardList.css';
import MangaCard from './MangaCard.js';

const MangaCardList = ({ mangaArray, genre, search, bookmark }) => {
  return (
    <div className='manga-list'>
      {mangaArray.map((manga, id) => {
        let data;
        const {
          SeriesName,
          IndexName,
          imageUrl,
          serialName,
          name,
          alias,
          s,
          i,
        } = manga;
        if (genre) data = { imageUrl, name, alias: serialName };
        else if (bookmark) data = { imageUrl, name, alias };
        else if (search)
          data = {
            imageUrl: `https://temp.compsci88.com/cover/${i}.jpg`,
            name: s,
            alias: i,
          };
        else
          data = {
            imageUrl: `https://temp.compsci88.com/cover/${IndexName}.jpg`,
            name: SeriesName,
            alias: IndexName,
          };
        return (
          <MangaCard
            imageUrl={data.imageUrl}
            key={id}
            mangaTitle={data.name}
            alias={data.alias}
          />
        );
      })}
    </div>
  );
};

export default MangaCardList;
