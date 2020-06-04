import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../components/js/Loader.js';
import ErrorMessage from '../../components/js/ErrorMessage.js';

class RecentUpdate extends React.Component {
	constructor() {
		super();
		this.state = {
			allManga: [],
			displayedManga: [],
			count: 10,
			hasMoreItems: true
		}
	}

	componentDidMount() {
		this.fetchManga();
	}

	displayManga = () => {
		if (this.state.allManga.length >= this.state.count) {
			this.setState({ 
				count: this.state.count + 10, //increase back to 100
				displayedManga: this.state.allManga.slice(0, this.state.count)
			})
		}
	}

	fetchManga = () => {
		if (this.state.allManga === null) {
			this.setState({
				allManga: [],
				hasMoreItems: true 
			})
		}
		let currentManga = this.state.allManga;

		fetch('https://www.mangaeden.com/api/list/0/')
    		.then(res => res.json())
    		.then(data => {
	    		data.manga = data.manga.filter(manga => {
		    		return manga.im !== null && manga.c.length !== 0;
		    	})
		    	data.manga = data.manga.sort((a, b) => b.h - a.h).sort((a, b) => b.ld - a.ld)
		   		currentManga = data.manga;

		   		this.setState({ allManga: currentManga })
				this.displayManga();
    		})
    		.catch(err => {
    			this.setState({
    				allManga: null,
    				hasMoreItems: false
    			})
    		})
	}


	render() {
		const renderedContent = (this.state.allManga === null) ? 
								<ErrorMessage renderList={this.fetchManga} /> :
								<InfiniteScroll
									pageStart={0}
									loadMore={this.displayManga.bind(this)}
									hasMore={this.state.hasMoreItems}
									loader={<Loader key={0} />}
								>
									<MangaCardList mangaArray={this.state.displayedManga} />
								</InfiniteScroll>
		return(
				<div className='recent'>
					<Header currentMenu='Recently Updated' onSearchPage={false} />
					<NavBar page='recent' />
					{renderedContent}
				</div>
		)
	}
}

export default RecentUpdate;