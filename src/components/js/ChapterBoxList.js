import React from 'react';
import ChapterBox from './ChapterBox.js';
import { useHistory } from "react-router-dom";

const ChapterBoxList = ({ allChapters, mangaName, mangaId }) => {
	const history = useHistory();
	return (
			<div className='chapters-list'>
				{
					allChapters.map((chapter, i) => {
						return (
								<ChapterBox 
									number={chapter[0]} 
									title={chapter[2]}
									time={chapter[1]} 
									completed={chapter[5]}
									page={chapter[4]}
									key={i}
									displayChapter={function() {
										history.push(`/${mangaName}/${mangaId}/chapter/${chapter[0]}/${chapter[3]}`);
									}}
								 />
							)
					})
				}
			</div>
		)
}

export default ChapterBoxList;