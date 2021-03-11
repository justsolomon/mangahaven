import React from 'react';
import '../css/ChapterBox.css';

const ChapterBox = ({
  number,
  title,
  uploadDate,
  completed,
  page,
  displayChapter,
  continueChapter,
}) => {
  const date = new Date(uploadDate).toLocaleDateString();
  return (
    <div
      className={
        !completed ? 'manga-chapter' : 'manga-chapter chapter-completed'
      }
      onClick={page === undefined ? displayChapter : continueChapter}
    >
      <p className='chapter-name'>
        {title ? `Chapter ${number} - ${title}` : `Chapter ${number}`}
      </p>
      <div className='chapter-details'>
        <p className='release-date'>{date}</p>
        {page !== undefined ? (
          <p className='history-page-number'>
            {`Page: ${page} ${completed ? `(Completed)` : ''}`}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ChapterBox;
