import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import localForage from 'localforage';

class Favorites extends React.Component {
	constructor() {
		super();
		this.state = {
			userFav: []
		}
	}

	componentDidMount() {
		//check if user favorites exists in storage
		localForage.getItem('userFavorites')
			.then(value => this.setState({ userFav: value }))
			.catch(err => console.log(err))
	}

	render() {
		const { userFav } = this.state;
		return (
			<div className='favorite-manga'>
				<Header currentMenu={'Favorites'} />
				<NavBar />
				{
					(userFav === null) ?
					<p style={{textAlign: 'center'}}>You don't have any favorited manga yet</p> :
					<MangaCardList mangaArray={userFav} />
				}
			</div>
		)
	}
}

export default Favorites;