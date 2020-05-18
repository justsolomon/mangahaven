import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
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
import {
  EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  RedditShareButton, RedditIcon,
  TelegramShareButton, TelegramIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon
} from "react-share";
import {CopyToClipboard} from 'react-copy-to-clipboard';
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
			disabled: true,
			shareBox: false,
			urlCopied: false
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

	displayShare = () => {
		this.setState({ shareBox: !this.state.shareBox })
	}

	saveToStorage = (state, location) => {
		let { manga } = this.state;
		if (state) {	
			if (localStorage[location]) {
				let bookmarks = JSON.parse(localStorage[location]);
				bookmarks.push({
					a: manga.alias,
					im: manga.image,
					i: this.props.match.params.id,
					t: manga.title,
					added: new Date().getTime()
				})
				localStorage[location] = JSON.stringify(bookmarks)
			} else {
				let bookmarks = [];
				bookmarks.push({
					a: manga.alias,
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
		const url = window.location.href;
		const shareDescription = `Read ${title} online for free on MangaHaven`;

		return (
				<div className='manga-page'>
					<div className='manga-header'>
						<div className='manga-header-nav'>
							<div className='manga-header-title'>
								<BackButton toggleSearch={this.props.history.goBack} />
								<p>{title}</p>
							</div>
							<FontAwesomeIcon onClick={this.displayShare} icon={faShareAlt} className={info ? 'active' : 'inactive'} />
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
										<TelegramIcon size={45} round={true} />
									</TelegramShareButton>
									<p>Telegram</p>
								</div>
							</div>
						</div>

						<div className={this.state.urlCopied ? 'active copy-success' : 'copy-success'}>
							<span>Copied to clipboard</span>
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