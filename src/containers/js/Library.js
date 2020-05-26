import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import localForage from 'localforage';

class Library extends React.Component {
	constructor() {
		super();
		this.state = {
			library: []
		}
	}

	componentDidMount() {
		//check if user favorites exists in storage
		localForage.getItem('userBookmarks')
			.then(value => this.setState({ library: value }))
			.catch(err => console.log(err))
	}

	render() {	
		const { library } = this.state;
		return (
			<div className='manga-library'>
				<Header currentMenu={'Library'} />
				<NavBar />
				{
					(library === null) ?
					<p style={{textAlign: 'center'}}>You don't have any bookmarked manga yet</p> :
					<MangaCardList mangaArray={library} />
				}
			</div>
		)
	}
}

export default Library;