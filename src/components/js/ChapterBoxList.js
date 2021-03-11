import React from 'react';
import ChapterBox from './ChapterBox.js';
import { useHistory } from 'react-router-dom';

const ChapterBoxList = ({ allChapters, mangaName }) => {
  const history = useHistory();
  return (
    <div className='chapters-list'>
      {allChapters.map((chapter, i) => {
        const {
          chapterNum,
          Date,
          ChapterName,
          completed,
          currentPage,
        } = chapter;
        return (
          <ChapterBox
            number={chapterNum}
            title={ChapterName}
            uploadDate={Date}
            completed={completed}
            page={currentPage}
            key={i}
            displayChapter={() => {
              history.push(`/read/${mangaName}/chapter/${chapterNum}/`);
            }}
            continueChapter={() => {
              history.push(
                `/read/${mangaName}/chapter/${chapterNum}?q=${chapter[4]}`
              );
            }}
          />
        );
      })}
    </div>
  );
};

export default ChapterBoxList;
