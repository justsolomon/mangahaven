import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../components/js/Loader.js';
import ErrorMessage from '../../components/js/ErrorMessage.js';

class ExplorePage extends React.Component {
	constructor() {
		super();
		this.state = {
			allManga: [],
			hasMoreItems: true,
			nextPage: 0
		}
	}

	loadManga = () => {
		if (this.state.nextPage > 14) {
	    	this.setState({ hasMoreItems: false });
	    	return;
		}

		if (this.state.allManga === null) {
			this.setState({
				allManga: [],
				hasMoreItems: true,
				nextPage: 0
			})
		};
		let currentManga = this.state.allManga;
		let currentPage = this.state.nextPage;

		fetch(`https://www.mangaeden.com/api/list/0/?p=${currentPage}`)
    		.then(res => res.json())
    		.then(data => {
	    		if (data.manga.length !== 0) {
	    			data.manga = data.manga.filter(manga => {
		    			return manga.im !== null && manga.c.length !== 0;
		    		})
		    		data.manga = data.manga.sort((a, b) => b.h - a.h)
		    		
		    		if (currentManga === null) currentManga = [];
		    		currentManga.push(...data.manga.slice(0, 10)); //increase back to 100 during production

		    		this.setState({ 
		    			allManga: currentManga,
		    			nextPage: currentPage + 1
		    		})
	    		} 
    		})
    		.catch(err => {
    			if (this.state.nextPage === 0) {
	    			this.setState({
	    				allManga: null,
	    				hasMoreItems: false
	    			})
    			} else {
    				(() => {
    					this.setState({ hasMoreItems: false })
    					setTimeout(() => this.setState({ hasMoreItems: true }), 1000)
    				})()
    			}
    		})
	}

	render() {
		const renderedContent = (this.state.allManga === null) ? 
								<ErrorMessage renderList={this.loadManga} /> :
								<InfiniteScroll
									pageStart={0}
									loadMore={this.loadManga.bind(this)}
									hasMore={this.state.hasMoreItems}
									loader={<Loader key={0} />}
								>
									<MangaCardList mangaArray={this.state.allManga} />
								</InfiniteScroll>
		return(
				<div className='explore-page'>
					<Header currentMenu='Explore' onSearchPage={false} />
					<NavBar page='explore' />
					{renderedContent}
				</div>
		)
	}
}

export default ExplorePage;