import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
// import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import { AllHtmlEntities } from 'html-entities';
import BackButton from '../../components/js/BackButton.js';
import ChapterBoxList from '../../components/js/ChapterBoxList.js';
import Image from '../../components/js/Image.js';
import Loader from '../../assets/image-loading.gif';
import {
  EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  RedditShareButton, RedditIcon,
  TelegramShareButton, TelegramIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon
} from "react-share";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SwipeableViews from 'react-swipeable-views';
import localForage from 'localforage';
import { Helmet } from "react-helmet";
import NavBar from './NavBar.js';
import '../css/MangaPage.css';

class MangaPage extends React.Component {
	constructor() {
		super();
		this.state = {
			manga: {},
			chapters: [],
			aka: [],
			lastChapter: '',
			genres: [],
			status: ['Ongoing', 'Ongoing', 'Completed'],
			imageUrl: '',
			gottenData: false,
			bookmark: false,
			favorite: false,
			disabled: true,
			shareBox: false,
			urlCopied: false,
			menuIndex: 0,
			networkError: false,
			networkLoader: false,
			offlineData: false
		}
	}

	componentDidMount() {
		this.fetchMangaInfo();
	}

	fetchMangaInfo = () => {
		this.setState({ networkLoader: true })
		const { id, name } = this.props.match.params;
		fetch(`https://www.mangaeden.com/api/manga/${id}/`)
			.then(res => res.json())
			.then(data => {
				this.updateOfflineChapters(data.chapters, data.title);
				this.checkReadChapters(data.chapters, data.title);
				this.setState({
					manga: data,
					aka: data.aka,
					lastChapter: data.chapters[0][0],
					genres: data.categories,
					imageUrl: `https://cdn.mangaeden.com/mangasimg/${data.image}`,
					gottenData: true,
					disabled: false,
					networkError: false,
					networkLoader: false,
					offlineData: false
				});
				this.checkStorage(data.title);
				console.log(data)
			})
			.catch(err => {
				//check if the manga info exists in storage
				localForage.getItem('offlineManga')
					.then(allManga => {
						if (allManga !== null) {
							let currentManga = allManga.filter(manga => manga.alias === name);
							if (currentManga !== []) {
								currentManga = currentManga[0];	
								this.setState({
									manga: currentManga,
									aka: currentManga.aka,
									chapters: currentManga.chapters,
									lastChapter: currentManga.chapters[0][0],
									genres: currentManga.categories,
									imageUrl: `https://cdn.mangaeden.com/mangasimg/${currentManga.image}`,
									gottenData: true,
									disabled: false,
									networkError: false,
									networkLoader: false,
									offlineData: true
								})
								this.checkStorage(currentManga.title);
							} else {
								this.setState({ 
									networkError: true,
									networkLoader: false
								})
							}
						} else {
							this.setState({ 
								networkError: true,
								networkLoader: false
							})
						}
					})
					.catch(err => {
						this.setState({ 
							networkError: true,
							networkLoader: false
						})
					})
			})
	}

	changeToInfo = () => this.setState({ menuIndex: 0 })

	changeToChapters = () => this.setState({ menuIndex: 1 })

	changeIndex = () => {
		let { menuIndex } = this.state;
		if (menuIndex === 0) this.setState({ menuIndex: 1 });
		else this.setState({ menuIndex: 0 });
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

	displayShare = () => {
		this.setState({ shareBox: !this.state.shareBox })
	}

	saveToStorage = (state, location) => {
		let { manga } = this.state;
		if (state) {
			//store basic info to favorites/bookmarks
			localForage.getItem(location)
				.then(value => {
					if (value !== null) {
						let bookmarks = value;
						bookmarks.push({
							a: manga.alias,
							im: manga.image,
							i: this.props.match.params.id,
							t: manga.title,
							added: new Date().getTime()
						})
						localForage.setItem(location, bookmarks)
							.then(value => console.log(value))
							.catch(err => console.log(err))
					} else {
						let bookmarks = [];
						bookmarks.push({
							a: manga.alias,
							im: manga.image,
							i: this.props.match.params.id,
							t: manga.title,
							added: new Date().getTime()
						})
						localForage.setItem(location, bookmarks)
							.then(value => console.log(value))
							.catch(err => console.log(err));
					}
				})
				.catch(err => console.log(err));

			//store entire info in a catalogue for offline use
			localForage.getItem('offlineManga')
				.then(allManga => {
					if (allManga !== null) {
						//to check if manga already exists in storage
						let mangaPresent = false;
						for (let i = 0; i < allManga.length; i++) {
							if (allManga[i].title === manga.title) {
								mangaPresent = true;
								break;
							}
						}
						if (!mangaPresent) {
							allManga.push(manga);
							localForage.setItem('offlineManga', allManga)
								.then(value => console.log(value))
								.catch(err => console.log(err))
						}
					} else {
						let allManga = [];
						allManga.push(manga);
						localForage.setItem('offlineManga', allManga)
							.then(value => console.log(value))
							.catch(err => console.log(err));
					}
					console.log(allManga);
				})
				.catch(err => console.log(err));
		} else {
			//remove basic manga info from favorites/bookmarks
			localForage.getItem(location)
				.then(bookmarks => {
					bookmarks = bookmarks.filter(manga => manga.t !== this.state.manga.title);
					console.log(bookmarks)
					console.log(bookmarks.length)
					if (bookmarks.length === 0) {
						localForage.removeItem(location)
							.then(() => console.log('key removed'))
							.catch(err => console.log(err))

						localForage.keys().then(keys => console.log(keys)).catch(err => console.log(err));
					} else {
						localForage.setItem(location, bookmarks)
							.then(value => console.log(value))
							.catch(err => console.log(err));

						localForage.keys().then(keys => console.log(keys)).catch(err => console.log(err));
					}
				})
				.catch(err => console.log(err));

			//remove entire manga info from catalogue to avoid space wastage
			// localForage.getItem('offlineManga')
			// 	.then(allManga => {
			// 		allManga = allManga.filter(manga => manga.title !== this.state.manga.title);
			// 		localForage.setItem('offlineManga', allManga)
			// 			.then(value => console.log(value))
			// 			.catch(err => console.log(err))
			// 	})
			// 	.catch(err => console.log(err));
		}
	}

	checkStorage = (title) => {
		//check if it has been bookmarked/favorited
		const runCheck = location => {
			localForage.getItem(location)
				.then(value => {
					if (value !== null) {
						let mangaArray = value;
						for (let i = 0; i < mangaArray.length; i++) {
							if (mangaArray[i].t === title) {
								if (location === 'userFavorites') this.setState({ favorite: true })
								else this.setState({ bookmark: true })
								break;
							}
						}
					}
				})
				.catch(err => console.log(err));
		}
		runCheck('userFavorites');
		runCheck('userBookmarks');
	}

	checkReadChapters = (chapters, title) => {
		localForage.getItem('offlineManga')
			.then(value => {
				if (value !== null) {	
					let offlineChapters;
					for (let i = 0; i < value.length; i++) {
						if (value[i].title === title) {
							offlineChapters = value[i].chapters;
							for (let i = 0; i < chapters.length; i++) {
								for (let j = 0; j < offlineChapters.length; j++) {
									if (chapters[i][3] === offlineChapters[j][3] && offlineChapters[j][4] !== undefined) {
										chapters[i][4] = offlineChapters[j][4];
										chapters[i][5] = offlineChapters[j][5];
										break;
									}
								}
							}
							break;
						}
					}
				}
				this.setState({ chapters });
			})
			.catch(err => console.log(err))
	}

	updateOfflineChapters = (chapters, title) => {
		localForage.getItem('offlineManga')
			.then(value => {
				if (value !== null) {	
					let offlineChapters;
					for (let i = 0; i < value.length; i++) {
						if (value[i].title === title) {
							offlineChapters = value[i].chapters;
							if (offlineChapters.length !== chapters.length) {
								for (let j = 0; j < chapters.length; j++) {
									for (let k = 0; k < offlineChapters.length; k++) {
										if (chapters[j][3] === offlineChapters[k][3] && offlineChapters[k][4] !== undefined) {
											chapters[j][4] = offlineChapters[k][4];
											chapters[j][5] = offlineChapters[k][5];
											break;
										}
									}
								}
								value[i].chapters = chapters;
								localForage.setItem('offlineManga', value)
									.then(manga => console.log(manga))
									.catch(err => console.log(err));
								break;
							}
						}
					}
				}
			})
			.catch(err => console.log(err))
	}

	render() {	
		const entities = new AllHtmlEntities();
		const { artist, alias, author, released, description, title, last_chapter_date, status } = this.state.manga;
		const { lastChapter, menuIndex, networkError, networkLoader, offlineData, imageUrl, aka } = this.state;
		const url = window.location.href;
		const shareDescription = `Read ${title} online for free on MangaHaven`;

		return (
				<div className='manga-page'>

					{/*change meta tags*/}
					<Helmet>
   						<title>{`${title} - MangaHaven`}</title>
    					<meta name="theme-color" content="#4664c8" />
						<meta
					      name="description"
					      content={description}
					    />
					    <meta property="og:title" content={shareDescription} />
					    <meta property="og:image" content={imageUrl} />
					    <meta 
					      property="og:description" 
					      content={description}
					    />
					    <meta property="twitter:title" content={shareDescription} />
					    <meta property="twitter:description" content={description} />
					    <meta property="twitter:image" content={imageUrl} />
    					<meta property="twitter:card" content="summary" />
					    <meta property="twitter:creator" content="@gbsolomon1" />
					    <meta property="twitter:site" content="@gbsolomon1" />
					</Helmet>

					<NavBar />

					<div className='manga-header'>
						<div className='manga-header-nav'>
							<div className='manga-header-title'>
								<BackButton clickAction={() => this.props.history.push('/')} />
								<p>{title}</p>
							</div>
							<div className='manga-header-buttons'>
								<FontAwesomeIcon onClick={this.displayShare} icon={faShareAlt} className={menuIndex === 0 ? 'active' : 'inactive'} />
								<FontAwesomeIcon icon={faSort} className={menuIndex === 1 ? 'active' : 'inactive'} onClick={this.sortChapters} />
								{/*<FontAwesomeIcon icon={faCommentDots} />*/}
							</div>
						</div>

						<div className='manga-details-nav'>
							<p 
								onClick={this.changeToInfo} 
								className={menuIndex === 0 ? 'current-menu' : ''}
							>
								INFO
							</p>
							<p 
								onClick={this.changeToChapters} 
								className={menuIndex === 1 ? 'current-menu' : ''}
							>
								CHAPTERS
							</p>
						</div>

						<div className={menuIndex === 0 ? 'active-menu-line' : 'active-menu-line chapter'}></div>

						<div className={offlineData ? 'error-active offline-message' : 'offline-message'}>
							<p>You're currently viewing an offline version of this page</p>
							<div className='action-buttons'>
								{
									!networkLoader ? 
									<p className='retry' onClick={this.fetchMangaInfo}>RELOAD</p> :
									<div><img className='network-load' src={Loader} alt='loader-icon' /></div>
								}
								<FontAwesomeIcon 
									onClick={() => this.setState({ offlineData: false })} 
									icon={faTimes} 
								/>
							</div>
						</div>
					</div>

					<div className={networkError ? 'error-active error-message' : 'error-message'}>
						<p>An error occurred while loading</p>
						{
							!networkLoader ? 
							<p className='retry' onClick={this.fetchMangaInfo}>RETRY</p> :
							<div><img className='network-load' src={Loader} alt='loader-icon' /></div>
						}
					</div>

					<div className='manga-details'>
						<SwipeableViews index={menuIndex} onChangeIndex={this.changeIndex}>
							<div className='manga-info'>
								<div className='manga-info-header'>
									<div className='manga-image'>
										<Image url={imageUrl} />
									</div>

									<div className='manga-info-details'>
										<p className='manga-title'>{title}</p>

										<p className='alternative-names'>
											Alternative name(s):
											<span>
											{
												aka.map((value, i) => {
													return (
														<span key={i}>
															{entities.decode(value)}
															<span style={{color: '#000'}}> | </span>
														</span>
													)
												})
											}
											</span>
										</p>

										<p className='manga-author'>
											Author:<span>{entities.decode(author)}</span>
										</p>

										<p className='manga-artist'>
											Artist:<span>{entities.decode(artist)}</span>
										</p>

										<p className='manga-created'>
											Released:<span>{released}</span>
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


							<div className='manga-chapters'>
								<ChapterBoxList 
									allChapters={this.state.chapters} 
									mangaName={alias} 
									mangaId={this.props.match.params.id} 
								/>
							</div>
						</SwipeableViews>

						<div 
							className={this.state.shareBox ? 'active manga-share-box' : 'manga-share-box'} 
							onClick={this.displayShare}
						>
							<div className='manga-share-box-inner' onClick={e => e.stopPropagation()}>
								<div className='share-button'>
									<CopyToClipboard 
										text={`${shareDescription}\n\n${url}`}
										onCopy={() => {
											this.displayShare();
											this.setState({ urlCopied: true });
											setTimeout(() => {this.setState({ urlCopied: false })}, 1000)
										}}
									>
										<FontAwesomeIcon icon={faCopy} />
									</CopyToClipboard>
									<p>Copy to clipboard</p>
								</div>
								<div className='share-button'>
									<WhatsappShareButton 
										url={url}
										title={shareDescription}
										separator={`\n\n`}
									>
										<WhatsappIcon size={50} round={true} />
									</WhatsappShareButton>
									<p>Whatsapp</p>
								</div>
								<div className='share-button'>
									<FacebookShareButton 
										url={url}
										quote={shareDescription}
										hashtag='#manga'
									>
										<FacebookIcon size={50} round={true} />
									</FacebookShareButton>
									<p>Facebook</p>
								</div>
								<div className='share-button'>
									<TwitterShareButton 
										url={url}
										title={shareDescription}
										hashtags={['manga', 'anime', 'otaku', 'art']}
										related={['gbsolomon1']}
									>
										<TwitterIcon size={50} round={true} />
									</TwitterShareButton>
									<p>Twitter</p>
								</div>
								<div className='share-button'>
									<EmailShareButton 
										url={url}
										subject={shareDescription}
									>
										<EmailIcon size={50} round={true} />
									</EmailShareButton>
									<p>Email</p>
								</div>
								<div className='share-button'>
									<RedditShareButton 
										url={url}
										title={shareDescription}
									>
										<RedditIcon size={50} round={true} />
									</RedditShareButton>
									<p>Reddit</p>
								</div>
								<div className='share-button'>
									<TelegramShareButton 
										url={url}
										title={shareDescription}
									>
										<TelegramIcon size={50} round={true} />
									</TelegramShareButton>
									<p>Telegram</p>
								</div>
							</div>
						</div>

						<div className={this.state.urlCopied ? 'active copy-success' : 'copy-success'}>
							<span>Copied to clipboard</span>
						</div>
					</div>
				</div>
			)
	}
}

export default withRouter(MangaPage);