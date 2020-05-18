import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';

const Library = () => {
	return (
		<div className='manga-library'>
			<Header currentMenu={'Library'} />
			<NavBar />
			{
				(localStorage['userBookmarks'] === undefined) ?
				<p>No bookmarks found</p> :
				<MangaCardList mangaArray={JSON.parse(localStorage['userBookmarks'])} />
			}
		</div>
	)
}

export default Library;