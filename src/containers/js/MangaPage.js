import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import { AllHtmlEntities } from 'html-entities';
import BackButton from '../../components/js/BackButton.js';
import ChapterBoxList from '../../components/js/ChapterBoxList.js';
import Image from '../../components/js/Image.js';
import '../css/MangaPage.css';

class MangaPage extends React.Component {
	constructor() {
		super();
		this.state = {
			manga: {},
			chapters: [],
			lastChapter: '',
			genres: [],
			info: true,
			chapter: false,
			status: ['Ongoing', 'Ongoing', 'Completed'],
			imageUrl: '',
			gottenData: false,
			bookmark: false,
			favorite: false,
			disabled: true
		}
	}

	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`https://www.mangaeden.com/api/manga/${id}/`)
			.then(res => res.json())
			.then(data => {
				this.setState({
					manga: data,
					chapters: data.chapters,
					lastChapter: data.chapters[0][0],
					genres: data.categories,
					imageUrl: `https://cdn.mangaeden.com/mangasimg/${data.image}`,
					gottenData: true,
					bookmark: this.checkStorage('userBookmarks', data.title),
					favorite: this.checkStorage('userFavorites', data.title),
					disabled: false
				})
				console.log(data)
			})
			.catch(console.log)		
	}

	changeToInfo = () => {
		this.setState({
			info: true,
			chapter: false
		})
	}

	changeToChapters = () => {
		this.setState({
			info: false,
			chapter: true
		})
	}

	sortChapters = () => {
		this.setState({
			chapters: this.state.chapters.reverse()
		})
	}

	formatDescription = (desc) => {
		return desc.replace(desc.slice(desc.indexOf('Note'), desc.length), '');
	}

	getNote = (desc) => {
		return desc.slice(desc.indexOf('Note'), desc.length);
	}

	toggleBookmark = () => {
		this.setState({ bookmark: !this.state.bookmark });
		this.saveToStorage(!this.state.bookmark, 'userBookmarks');
	}

	toggleFav = () => {
		this.setState({ favorite: !this.state.favorite });
		this.saveToStorage(!this.state.favorite, 'userFavorites');
	}

	saveToStorage = (state, location) => {
		let { manga } = this.state;
		if (state) {	
			if (localStorage[location]) {
				let bookmarks = JSON.parse(localStorage[location]);
				bookmarks.push({
					a: manga.artist,
					im: manga.image,
					i: this.props.match.params.id,
					t: manga.title,
					added: new Date().getTime()
				})
				localStorage[location] = JSON.stringify(bookmarks)
			} else {
				let bookmarks = [];
				bookmarks.push({
					a: manga.artist,
					im: manga.image,
					i: this.props.match.params.id,
					t: manga.title,
					added: new Date().getTime()
				})
				localStorage[location] = JSON.stringify(bookmarks)
			}
		} else {
			let bookmarks = JSON.parse(localStorage[location]);

			bookmarks = bookmarks.filter(manga => {
				return manga.t !== this.state.manga.title
			})
			localStorage[location] = JSON.stringify(bookmarks);
		}
	}

	checkStorage = (location, title) => {
		//check if it has been bookmarked/favorited
		let result;
		if (localStorage[location] !== undefined){
			let mangaArray = JSON.parse(localStorage[location]);
			for (let i = 0; i < mangaArray.length; i++) {
				console.log(mangaArray[i].t, title)
				if (mangaArray[i].t === title) {
					result = true;
					break;
				} else {
					result = false;
				};
			}
		} else result = false;
		return result;
	}

	render() {	
		const entities = new AllHtmlEntities();
		const { artist, alias, author, created, description, title, last_chapter_date, status } = this.state.manga;
		const { info, chapter, lastChapter } = this.state;

		return (
				<div className='manga-page'>
					<div className='manga-header'>
						<div className='manga-header-nav'>
							<div className='manga-header-title'>
								<BackButton toggleSearch={this.props.history.goBack} />
								<p>{title}</p>
							</div>
							<FontAwesomeIcon icon={faShareAlt} className={info ? 'active' : 'inactive'} />
							<FontAwesomeIcon icon={faSort} className={chapter ? 'active' : 'inactive'} onClick={this.sortChapters} />
							<FontAwesomeIcon icon={faCommentDots} />
						</div>
						<div className='manga-details-nav'>
							<p onClick={this.changeToInfo}>INFO</p>
							<p onClick={this.changeToChapters}>CHAPTERS</p>
						</div>
						<div className='active-lines'>
							<div className={info ? 'active' : 'inactive'}></div>
							<div className={chapter ? 'active' : 'inactive'}></div>
						</div>
					</div>

					<div className='manga-details'>
						<div className={info ? 'active manga-info' : 'inactive manga-info'}>
							<div className='manga-info-header'>
								<div className='manga-image'>
									<Image url={this.state.imageUrl} />
								</div>

								<div className='manga-info-details'>
									<p className='manga-title'>{title}</p>

									<p className='manga-author'>
										Author:<span>{entities.decode(author)}</span>
									</p>

									<p className='manga-artist'>
										Artist:<span>{entities.decode(artist)}</span>
									</p>

									<p className='manga-created'>
										Created:
										<span>
											{
												this.state.gottenData ? 
												new Date(created * 1000).toLocaleDateString() : null
											}
										</span>
									</p>

									<p className='manga-last-chapter'>
										Last chapter:<span>{lastChapter}</span>
									</p>

									<p className='manga-last-updated'>
										Updated:
										<span>
											{
												this.state.gottenData ? 
												new Date(last_chapter_date * 1000).toLocaleDateString() : null
											}
										</span>
									</p>

									<p className='manga-status'>
										Status:<span>{this.state.status[status]}</span>
									</p>
								
								</div>
							</div>

							<div className='action-icon-buttons'>
								<button 
									className='bookmark-icon' 
									onClick={this.toggleBookmark} 
									disabled={this.state.disabled}
								>
									{
										!this.state.bookmark ? 
										<FontAwesomeIcon icon={regularBookmark} /> : 
										<FontAwesomeIcon icon={solidBookmark} />
									}
								</button>
								<button 
									className='heart-icon' 
									onClick={this.toggleFav} 
									disabled={this.state.disabled}
								>
									{
										!this.state.favorite ? 
										<FontAwesomeIcon icon={regularHeart} /> : 
										<FontAwesomeIcon icon={solidHeart} />
									}
								</button>
							</div>

							<div className='manga-description'>
								<div className='manga-genres'>
									<p>Genres</p>
									<div className='genre-links'>
										{
											this.state.genres.join(', ').split(' ').map((genre, i) => {
												return <a href={`/genre/${genre.replace(',', '').toLowerCase()}`} key={i}>{genre}</a>
											})
										}
									</div>
								</div>
								<div className='manga-description-details'>
									<p>Description</p>
									<div className='manga-description-note'>
										<p>{this.formatDescription(entities.decode(description))}</p>
										<p>{this.getNote(entities.decode(description))}</p>
									</div>
								</div>
							</div>
						</div>

						<div className={chapter ? 'active manga-chapters' : 'inactive manga-chapters'}>
							<ChapterBoxList 
								allChapters={this.state.chapters} 
								mangaName={alias} 
								mangaId={this.props.match.params.id} 
							/>
						</div>
					</div>
				</div>
			)
	}
}

export default withRouter(MangaPage);