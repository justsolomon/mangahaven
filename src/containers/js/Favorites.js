import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';

const Favorites = () => {
	return (
		<div className='favorite-manga'>
			<Header currentMenu={'Favorites'} />
			<NavBar />
			{
				(localStorage['userFavorites'] === undefined) ?
				<p>No favorited manga found</p> :
				<MangaCardList mangaArray={JSON.parse(localStorage['userFavorites'])} />
			}
		</div>
	)
}

export default Favorites;