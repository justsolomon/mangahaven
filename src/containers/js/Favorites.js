import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import localForage from 'localforage';

class Favorites extends React.Component {
	constructor() {
		super();
		this.state = {
			userFav: [],
			displayedManga: []
		}
	}

	componentDidMount() {
		//check if user favorites exists in storage
		localForage.getItem('userFavorites')
			.then(value => {
				if (value !== null) value.reverse();
				this.setState({ 
					userFav: value,
					displayedManga: value
				})
			})
			.catch(err => console.log(err))
	}

	filterManga = (keyword) => {
		let { userFav, displayedManga } = this.state;

		displayedManga = userFav.filter(manga => {
			const regex = new RegExp(keyword, 'gi');
			return manga.a.match(regex) || manga.t.match(regex);
		});
		this.setState({ displayedManga });
	}

	render() {
		const { userFav, displayedManga } = this.state;
		return (
			<div className='favorite-manga'>
				<Header currentMenu={'Favorites'} localSearch={true} searchManga={this.filterManga} />
				<NavBar page='favorite' />
				{
					(userFav === null) ?
					<p style={{textAlign: 'center'}}>You don't have any favorited manga yet</p> :
					<MangaCardList mangaArray={displayedManga} />
				}
			</div>
		)
	}
}

export default Favorites;