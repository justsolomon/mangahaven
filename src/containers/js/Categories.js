import React from 'react';
import Header from '../../components/js/Header.js';
import Loader from '../../components/js/Loader.js';
import CategoryList from '../../components/js/CategoryList.js';
import ErrorMessage from '../../components/js/ErrorMessage.js';
import NavBar from './NavBar.js';
import { Helmet } from "react-helmet";
import '../css/Categories.css';

class Categories extends React.Component {
	constructor() {
		super();
		this.state = {
			categoryManga: [],
			loader: true
		}
	}

	componentDidMount() {
		this.loadManga();
	}

	loadManga = () => {
		if (this.state.categoryManga === null) {
			this.setState({
				categoryManga: [],
				loader: true
			})
		}
		let categories = [];
		let categoryManga = [];

		fetch('https://www.mangaeden.com/api/list/0')
			.then(res => res.json())
			.then(data => {
				//filter manga without images and categories
				data.manga = data.manga.filter(manga => {
		    					return manga.im !== null && manga.c.length !== 0;
		    				})

				//sort manga according to no of hits
		    	data.manga = data.manga.sort((a, b) => b.h - a.h)
				
		    	//push all available categories into array
				data.manga.forEach(manga => {
					if (manga.c !== []) {
						manga.c.forEach(category => {
							if (!categories.includes(category)) categories.push(category);
						}) 
					}
				})

				//place manga according to category
				categories.forEach(category => {
					let availableManga = [];
					let count = 0;
					for (let j = 0; j < data.manga.length; j++) {	
						if (count === 100) break;
						if (data.manga[j].c.includes(category)) {
							count += 1;
							availableManga.push(data.manga[j]);
							data.manga = data.manga.filter(current => current.i !== data.manga[j].i);
						}
					}
					categoryManga.push({
						category,
						manga: availableManga
					})
				})


				this.setState({ 
						categoryManga,
						loader: false
					});
			})
			.catch(err => {
				this.setState({ 
					categoryManga: null,
					loader: false 
				})
			})
	}

	render() {
		const renderedContent = (this.state.categoryManga === null) ?
								<ErrorMessage renderList={this.loadManga} /> :
								<CategoryList categoryManga={this.state.categoryManga} />

		const loader = (this.state.loader) ? <Loader /> : null

		return(
				<div className='categories'>
					<Helmet>
						<title>All Genres Manga - MangaHaven</title>
    					<meta name="theme-color" content="#4664c8" />
					</Helmet>
					<Header currentMenu='All Genres' onSearchPage={false} />
					<NavBar page='all-genre' />
					{loader}
					{renderedContent}
				</div>
			)
	}
}

export default Categories;