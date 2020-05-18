import React from 'react';
import '../css/ChapterBox.css';

const ChapterBox = ({ number, title, time, displayChapter }) => {
	const date = new Date(time * 1000).toLocaleDateString();
	return (
			<div className='manga-chapter' onClick={displayChapter}>
				<p className='chapter-name'>
					{(title !== null) ? `Chapter ${number} - ${title}` : `Chapter ${number}`}
				</p>
				<p className='release-date'>{date}</p>
			</div>
		)
}

export default ChapterBox;