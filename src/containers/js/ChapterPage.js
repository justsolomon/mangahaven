import React from 'react';
import ChapterImage from '../../components/js/ChapterImage.js';
import { Carousel } from 'react-responsive-carousel';
import { withRouter } from 'react-router-dom';
import { InView } from 'react-intersection-observer';
import ImageLoader from '../../assets/loader.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';
import BackButton from '../../components/js/BackButton.js';
import CheckButton from '../../components/js/CheckButton.js';
import { Line } from 'rc-progress';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../css/ChapterPage.css';

class ChapterPage extends React.Component {
	constructor() {
		super();
		this.state = {
			chapterImages: [],
			chapterNumber: '',
			nextChapter: 0,
			prevChapter: 0,
			mangaChapters: [],
			chapterTitle: '',
			mangaName: '',
			progress: 0,
			headerActive: false,
			view: 'horizontal',
			background: 'light',
			settings: false
		}
	}

	componentDidMount() {
		const { id, mangaid, number } = this.props.match.params;
		this.setState({ chapterNumber: number })

		fetch(`https://www.mangaeden.com/api/chapter/${id}`)
			.then(res => res.json())
			.then(data => this.setState({ chapterImages: data.images.reverse() }))
			.catch(err => console.log(err));

		fetch(`https://www.mangaeden.com/api/manga/${mangaid}`)
			.then(res => res.json())
			.then(data => {
				let index;
				//to find the current chapter array in the manga chapters
				for (let i = 0; i < data.chapters.length; i++) {
					if (data.chapters[i][0] === Number(number)) {
						index = i;
						break;
					} 
				}
				this.setState({
					mangaChapters: data.chapters,
					mangaName: data.title,
					chapterTitle: data.chapters[index][2],
					nextChapter: index - 1,
					prevChapter: index + 1
				})
				console.log(data);
			})
			.catch(err => console.log(err));
	}

	calcProgress = (current, total) => {
		let progress = Math.round((current / total) * 100);
		if (progress !== this.state.progress) this.setState({ progress })
	}

	toggleVertical = () => this.setState({ view: 'vertical' })

	toggleHorizontal = () => this.setState({ view: 'horizontal' })

	toggleDark = () => this.setState({ background: 'dark' })

	toggleLight = () => this.setState({ background: 'light' })

	displaySettings = () => this.setState({ settings: !this.state.settings })

	render() {	
		const { mangaid, name } = this.props.match.params;
		const { background, mangaChapters, chapterNumber, chapterTitle, nextChapter, prevChapter } = this.state;
		return (
			<div className='chapter-page'>
				<div className={this.state.headerActive ? 'active chapter-page-header' : 'chapter-page-header'}>
					<BackButton toggleSearch={() => this.props.history.push(`/manga/${name}/${mangaid}`)}/>
					<div className='header-title'>
						<p className='manga-title'>{this.state.mangaName}</p>
						<p className='chapter-number'>{`${chapterNumber}: ${chapterTitle}`}</p>
					</div>
					<FontAwesomeIcon icon={faCog} onClick={this.displaySettings} />
				</div>
				<div className={this.state.headerActive ? 'active chapter-page-footer' : 'chapter-page-footer'}>
					<FontAwesomeIcon 
						icon={faStepBackward} 
						onClick={
							() => {
								this.props.history.push(`/${name}/${mangaid}/chapter/${mangaChapters[prevChapter][0]}/${mangaChapters[prevChapter][3]}`)
								window.location.reload();
							}
						}
					/>
					<Line percent={this.state.progress} strokeWidth='2.5' strokeColor='#d3d3d3' />
					<FontAwesomeIcon 
						icon={faStepForward} 
						onClick={
							() => {
								this.props.history.push(`/${name}/${mangaid}/chapter/${mangaChapters[nextChapter][0]}/${mangaChapters[nextChapter][3]}`)
								window.location.reload();
							}
						}
					/>
				</div>
				<div 
					className=
						{
							this.state.settings ? 
							`block-active chapter-page-settings` : 
							`chapter-page-settings`
						}
					onClick={this.displaySettings}
				>
					<div 
						className={`${background} chapter-page-settings-inner`}
						onClick={e => e.stopPropagation()}
					>
						<div className='chapter-view'>
							<p>View</p>
							<div className='options'>
								<div className='horizontal-option' onClick={this.toggleHorizontal}>
									<CheckButton 
										classname='horizontal'
										view={this.state.view}
									/>
									<span>Horizontal</span>
								</div>

								<div className='vertical-option' onClick={this.toggleVertical}>
									<CheckButton 
										classname='vertical' 
										view={this.state.view} 
									/>
									<span>Vertical</span>
								</div>
							</div>
						</div>

						<div className='background-settings'>
							<p>Background</p>
							<div className='options'>
								<div className='background-light' onClick={this.toggleLight}>
									<CheckButton 
										classname='light' 
										view={background} 
									/>
									<span>Light</span>
								</div>
								<div className='background-dark' onClick={this.toggleDark}>
									<CheckButton 
										classname='dark' 
										view={background} 
									/>
									<span>Dark</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Carousel 
					showIndicators={false}
					showThumbs={false}
					axis={this.state.view}
					verticalSwipe={'standard'}
					onClickItem={() => this.setState({headerActive: !this.state.headerActive})}
					useKeyboardArrows={true}
					emulateTouch={true}
					selectedItem={this.state.selectedItem}
					statusFormatter={(current, total) => {
						this.calcProgress(current, total);
						return `Page ${current} of ${total}`;
					}}
				>
					{
						this.state.chapterImages.map((image, id) => {
							return (
									<InView key={id}>
										{
											({ inView, ref, entry }) => {
												return (
													<TransformWrapper 
														defaultScale={1} 
														wheel={{disabled: true}} 
														options={{maxScale: 2}} 
														doubleClick={{mode: 'zoomIn'}} 
														pan={{disabled: true}} 
														pinch={{disabled: true}}
													>
														<TransformComponent>
															<div 
																className={inView ? `${background} chapter-image` : `${background} chapter-image loading`} 
																key={id} 
																ref={ref}
															>
																<ChapterImage 
																	url={inView ? `https://cdn.mangaeden.com/mangasimg/${image[1]}` : <ImageLoader />} 
																/>
															</div>
														</TransformComponent>
													</TransformWrapper>
												)
											}
										}
									</InView>
							)
						})
					}
				</Carousel> 
			</div>
		)
	}
}

export default withRouter(ChapterPage);