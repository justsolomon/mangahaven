import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import InfiniteScroll from 'react-infinite-scroller';
import ErrorMessage from '../../components/js/ErrorMessage.js';
import Loader from '../../components/js/Loader.js';
import { Helmet } from "react-helmet";
import { withRouter } from 'react-router-dom';

class CategoryPage extends React.Component {
	constructor() {
		super();
		this.state = {
			manga: [],
			displayedManga: [],
			genre: '',
			count: 10,
			hasMoreItems: true
		}
	}

	componentDidMount() {
		let genre = this.props.match.params.name;
		genre = genre.replace(genre[0], genre[0].toUpperCase());
		this.setState({ genre });
		this.fetchManga();
	}

	displayManga = () => {
		if (this.state.manga.length >= this.state.count) {
			this.setState({ 
				count: this.state.count + 10, //increase back to 100 during production
				displayedManga: this.state.manga.slice(0, this.state.count)
			})
		}
	}

	fetchManga = () => {
		if (this.state.manga === null) {
			this.setState({
				manga: [],
				hasMoreItems: true
			})
		}
		let genreManga = [];

		fetch('https://www.mangaeden.com/api/list/0')
			.then(res => res.json())
			.then(data => {
				console.log(data)
				//filter manga without images and categories
				data.manga = data.manga.filter(manga => {
		    					return manga.im !== null && manga.c.length !== 0;
		    				})

				//sort manga according to no of hits
		    	data.manga = data.manga.sort((a, b) => b.h - a.h)
				
		    	//push all available categories into array
				data.manga.forEach(manga => {
					if (manga.c.includes(this.state.genre)) genreManga.push(manga);
				})

				this.setState({ manga: genreManga });
				this.displayManga();
			})
			.catch(err => {
				this.setState({ 
					manga: null,
					hasMoreItems: false 
				})
			})
	}

	render() {
		const { genre } = this.state;
		const renderedContent = (this.state.manga === null) ?
								<ErrorMessage renderList={this.loadManga} /> :
								<InfiniteScroll
									pageStart={0}
									loadMore={this.displayManga.bind(this)}
									hasMore={this.state.hasMoreItems}
									loader={<Loader key={0} />}
								>
									<MangaCardList mangaArray={this.state.displayedManga} />
								</InfiniteScroll>

		return(
				<div className={genre}>
					<Helmet>
						<title>{`${genre} Manga - MangaHaven`}</title>
    					<meta name="theme-color" content="#4664c8" />
					</Helmet>
					<Header currentMenu={genre} onSearchPage={false} />
					<NavBar />
					{renderedContent}
				</div>
			)
	}
}

export default withRouter(CategoryPage);