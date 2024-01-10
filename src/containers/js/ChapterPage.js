import React from 'react';
import ChapterImage from '../../components/js/ChapterImage.js';
import { Carousel } from 'react-responsive-carousel';
import { withRouter } from 'react-router-dom';
import { InView } from 'react-intersection-observer';
import Loader from '../../components/js/Loader.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';
import BackButton from '../../components/js/BackButton.js';
import CheckButton from '../../components/js/CheckButton.js';
import { Line } from 'rc-progress';
import Modal from 'react-modal';
import ErrorMessage from '../../components/js/ErrorMessage.js';
import { Helmet } from 'react-helmet';
import localForage from 'localforage';
import { API_BASE_URL } from '../../utils/config.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../css/ChapterPage.css';

class ChapterPage extends React.Component {
  constructor() {
    super();
    this.state = {
      manga: {},
      chapterIndex: 0,
      chapterImages: [],
      chapterNumber: '',
      defaultPage: 1,
      nextChapter: {},
      prevChapter: {},
      chapterTitle: '',
      mangaName: '',
      alias: '',
      progress: 0,
      headerActive: false,
      view: 'horizontal',
      background: 'light',
      readMode: 'normal',
      settings: false,
      loader: true,
      modalOpen: false,
      currentImage: [],
      modalColor: '#000',
      modalBG: 'rgba(255, 255, 255, 0.8)',
      networkError: false,
    };
  }

  componentDidMount() {
    //check if default preferences have been set beforehand
    localForage
      .getItem('userPreferences')
      .then((value) => {
        if (value !== null) {
          this.setState({
            view: value.readView,
            background: value.readBG,
            readMode: value.readMode,
          });
        }
        console.log(value);
      })
      .catch((err) => console.log(err));
    this.fetchData();
  }

  fetchData = () => {
    const { mangaName, chapterNum } = this.props.match.params;
    this.setState({
      alias: mangaName,
    });

    //check if user came from history page and parse page num from url
    const url = new URL(window.location.href);
    let pageNum = 1;
    if (url.search !== '') {
      let searchParams = new URLSearchParams(url.search);
      pageNum = Number(searchParams.get('q').trim());
    }

    this.setState({
      chapterNumber: chapterNum,
      networkError: false,
      defaultPage: pageNum,
    });

    fetch(`${API_BASE_URL}/${mangaName}/chapter/${chapterNum}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const {
          nextChapter,
          prevChapter,
          chapterNum,
          images,
          ChapterName,
          mangaName,
        } = data;
        this.setState({
          chapterImages: images,
          currentImage: images[pageNum - 1],
          chapterNumber: chapterNum,
          nextChapter,
          prevChapter,
          mangaName,
          chapterTitle: ChapterName,
          networkError: false,
        });
      })
      .catch((err) => this.setState({ networkError: true }));

    fetch(`${API_BASE_URL}/manga/${mangaName}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          manga: data,
          loader: false,
          networkError: false,
        });

        this.saveToHistory(data, pageNum);
        this.updateMangaCatalog(pageNum, false, data);

        console.log(data);
      })
      .catch((err) => this.setState({ networkError: true }));
  };

  calcProgress = (current, total) => {
    let progress = Math.round((current / total) * 100);
    if (progress !== this.state.progress) this.setState({ progress });
  };

  toggleVertical = () => this.setState({ view: 'vertical' });

  toggleHorizontal = () => this.setState({ view: 'horizontal' });

  toggleNormal = () => this.setState({ readMode: 'normal' });

  toggleWebtoon = () => this.setState({ readMode: 'webtoon' });

  toggleDark = () => {
    this.setState({
      background: 'dark',
      modalColor: '#fff',
      modalBG: 'rgba(0, 0, 0, 0.8)',
    });
  };

  toggleLight = () => {
    this.setState({
      background: 'light',
      modalColor: '#000',
      modalBG: 'rgba(255, 255, 255, 0.8)',
    });
  };

  displaySettings = () => this.setState({ settings: !this.state.settings });

  displayNextChapter = () => {
    const { mangaName } = this.props.match.params;
    const { nextChapter } = this.state;
    this.props.history.push(
      `/read/${mangaName}/chapter/${nextChapter.chapterNum}`
    );
    window.location.reload();
  };

  displayPrevChapter = () => {
    const { mangaName } = this.props.match.params;
    const { prevChapter } = this.state;
    this.props.history.push(
      `/read/${mangaName}/chapter/${prevChapter.chapterNum}`
    );
    window.location.reload();
  };

  saveToHistory = (manga, pageNum) => {
    const { chapterNum } = this.props.match.params;
    //fetch history from storage
    localForage
      .getItem('readHistory')
      .then((value) => {
        if (value === null) {
          let recentManga = [];
          recentManga.push({
            alias: manga.alias,
            image: manga.imageUrl,
            title: manga.name,
            chapterNum,
            page: 1,
            added: new Date().getTime(),
          });

          localForage
            .setItem('readHistory', recentManga)
            .then((value) => console.log(value))
            .catch((err) => console.log(err));
        } else {
          //check if manga already exists in history
          let mangaPresent = false;
          for (let i = 0; i < value.length; i++) {
            if (value[i].alias === manga.alias) {
              value[i].chapterNum = chapterNum;
              value[i].added = new Date().getTime();
              value[i].page = pageNum;
              mangaPresent = true;
              break;
            }
          }
          if (!mangaPresent) {
            value.push({
              alias: manga.alias,
              image: manga.imageUrl,
              title: manga.name,
              chapterNum,
              page: 1,
              added: new Date().getTime(),
            });
          }
          localForage
            .setItem('readHistory', value)
            .then((value) => console.log(value))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  updateMangaCatalog = (index, completed, manga) => {
    const { chapterIndex } = this.state;
    localForage
      .getItem('offlineManga')
      .then((allManga) => {
        //add new manga to catalog
        const addNewManga = (allManga, currentManga) => {
          currentManga.chapters[chapterIndex].currentPage = index;
          if (!currentManga.chapters[chapterIndex].completed)
            currentManga.chapters[chapterIndex].completed = completed;
          allManga.push(currentManga);
          localForage
            .setItem('offlineManga', allManga)
            .then((value) => console.log(value))
            .catch((err) => console.log(err));
        };
        if (allManga !== null) {
          let mangaPresent = false;
          let mangaIndex;
          for (let i = 0; i < allManga.length; i++) {
            if (allManga[i].name === manga.name) {
              mangaPresent = true;
              mangaIndex = i;
              break;
            }
          }
          if (!mangaPresent) addNewManga(allManga, manga);
          else {
            //update manga if its already existing in catalog
            allManga[mangaIndex].chapters[chapterIndex].currentPage = index;
            if (!allManga[mangaIndex].chapters[chapterIndex].completed)
              allManga[mangaIndex].chapters[chapterIndex].completed = completed;
            localForage
              .setItem('offlineManga', allManga)
              .then((value) => console.log(value))
              .catch((err) => console.log(err));
          }
        } else {
          let allManga = [];
          addNewManga(allManga, manga);
        }
      })
      .catch((err) => console.log(err));
  };

  updatePageNumber = (index) => {
    const { manga } = this.state;
    localForage
      .getItem('readHistory')
      .then((recentManga) => {
        if (recentManga !== null) {
          for (let i = 0; i < recentManga.length; i++) {
            if (recentManga[i].alias === manga.alias) {
              recentManga[i].page = index;
            }
          }
          localForage
            .setItem('readHistory', recentManga)
            .then((value) => console.log(value))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    Modal.setAppElement('#root');
    const {
      background,
      chapterNumber,
      chapterTitle,
      nextChapter,
      prevChapter,
      chapterImages,
      modalColor,
      modalBG,
      mangaName,
      defaultPage,
      alias,
    } = this.state;
    return (
      <div className={`chapter-page chapter-page-${background}`}>
        <Helmet>
          <title>{`${mangaName} - Chapter ${chapterNumber} - MangaHaven`}</title>
          <meta
            name='theme-color'
            content={background === 'light' ? '#FDFFFC' : '#000'}
          />
        </Helmet>
        {!this.state.networkError ? (
          <div className='chapter-page-inner'>
            <div
              className={
                this.state.headerActive
                  ? 'active chapter-page-header'
                  : 'chapter-page-header'
              }
            >
              <BackButton
                clickAction={() => this.props.history.push(`/manga/${alias}`)}
              />
              <div className='header-wrapper'>
                <div className='header-title'>
                  <p className='manga-title'>{mangaName}</p>
                  <p className='chapter-number'>{`${chapterNumber}${
                    chapterTitle !== null ? `: ${chapterTitle}` : ''
                  }`}</p>
                </div>
                <FontAwesomeIcon icon={faCog} onClick={this.displaySettings} />
              </div>
            </div>
            <div
              className={
                this.state.headerActive
                  ? 'active chapter-page-footer'
                  : 'chapter-page-footer'
              }
            >
              <FontAwesomeIcon
                icon={faStepBackward}
                onClick={this.displayPrevChapter}
              />
              <Line
                percent={this.state.progress}
                strokeWidth='2.5'
                strokeColor='#d3d3d3'
              />
              <FontAwesomeIcon
                icon={faStepForward}
                onClick={this.displayNextChapter}
              />
            </div>
            <div
              className={
                this.state.settings
                  ? `block-active chapter-page-settings`
                  : `chapter-page-settings`
              }
              onClick={this.displaySettings}
            >
              <div
                className={`${background} chapter-page-settings-inner`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className='chapter-view'>
                  <p>View</p>
                  <div className='options'>
                    <div
                      className='horizontal-option'
                      onClick={this.toggleHorizontal}
                    >
                      <CheckButton
                        classname='horizontal'
                        view={this.state.view}
                      />
                      <span>Horizontal</span>
                    </div>

                    <div
                      className='vertical-option'
                      onClick={this.toggleVertical}
                    >
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
                    <div
                      className='background-light'
                      onClick={this.toggleLight}
                    >
                      <CheckButton classname='light' view={background} />
                      <span>Light</span>
                    </div>
                    <div className='background-dark' onClick={this.toggleDark}>
                      <CheckButton classname='dark' view={background} />
                      <span>Dark</span>
                    </div>
                  </div>
                </div>

                <div className='reading-mode'>
                  <p>Mode</p>
                  <div className='options'>
                    <div className='normal-option' onClick={this.toggleNormal}>
                      <CheckButton
                        classname='normal'
                        view={this.state.readMode}
                      />
                      <span>Normal</span>
                    </div>
                    <div
                      className='webtoon-option'
                      onClick={this.toggleWebtoon}
                    >
                      <CheckButton
                        classname='webtoon'
                        view={this.state.readMode}
                      />
                      <span>Webtoon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {this.state.loader ? (
              <Loader background={background} />
            ) : (
              <Carousel
                showIndicators={false}
                showThumbs={false}
                axis={this.state.view}
                verticalSwipe={'standard'}
                onClickItem={() =>
                  this.setState({ headerActive: !this.state.headerActive })
                }
                useKeyboardArrows={true}
                emulateTouch={true}
                swipeable={true}
                selectedItem={defaultPage}
                statusFormatter={(current, total) => {
                  this.calcProgress(current, total);
                  return `Page ${current - 1} of ${total - 2}`;
                }}
                onChange={(index) => {
                  let completed = false;
                  if (index === chapterImages.length) completed = true;
                  if (index !== 0 && index !== chapterImages.length + 1) {
                    this.setState({ currentImage: chapterImages[index - 1] });
                    this.updateMangaCatalog(index, completed, this.state.manga);
                    this.updatePageNumber(index);
                  }
                }}
              >
                {/* To notify if there's a previous chapter */}
                <div className={`notify-chapter previous ${background}`}>
                  {this.state.prevChapter !== null ? (
                    <div>
                      <p>Current:</p>
                      <span>{`${chapterNumber}${
                        chapterTitle !== null ? `: ${chapterTitle}` : ''
                      }`}</span>

                      <p>Previous: </p>
                      <span>{`${prevChapter.chapterNum}${
                        prevChapter.ChapterName !== null
                          ? `: ${prevChapter.ChapterName}`
                          : ''
                      }`}</span>
                      <button
                        className={background}
                        onClick={this.displayPrevChapter}
                      >
                        {`Read Chapter ${prevChapter.chapterNum}`}
                      </button>
                    </div>
                  ) : (
                    <p className='no-chapter'>There's no previous chapter</p>
                  )}
                </div>

                {chapterImages.map((image, id) => {
                  return (
                    <InView key={id}>
                      {({ inView, ref, entry }) => {
                        return (
                          <div
                            className={
                              inView
                                ? `${background} chapter-image`
                                : `${background} chapter-image loading`
                            }
                            key={id}
                            ref={ref}
                            onDoubleClick={() => {
                              this.setState({
                                modalOpen: true,
                                headerActive: false,
                              });
                            }}
                          >
                            <ChapterImage url={inView ? image : ''} />
                          </div>
                        );
                      }}
                    </InView>
                  );
                })}

                {/* To notify if there's a next chapter */}
                <div className={`notify-chapter next ${background}`}>
                  {this.state.nextChapter !== null ? (
                    <div>
                      <p>Current:</p>
                      <span>{`${chapterNumber}${
                        chapterTitle !== null ? `: ${chapterTitle}` : ''
                      }`}</span>

                      <p>Next:</p>
                      <span>{`${nextChapter.chapterNum}${
                        nextChapter.ChapterName !== null
                          ? `: ${nextChapter.ChapterName}`
                          : ''
                      }`}</span>
                      <button
                        className={background}
                        onClick={this.displayNextChapter}
                      >
                        {`Read Chapter ${nextChapter[0]}`}
                      </button>
                    </div>
                  ) : (
                    <p className='no-chapter'>There's no next chapter</p>
                  )}
                </div>
              </Carousel>
            )}
            {/* modal for displaying images to allow zoom and download */}
            <Modal
              style={{
                overlay: {
                  zIndex: 3,
                  backgroundColor: modalBG,
                },
                content: {
                  padding: '0px',
                  inset: '30px 10px 10px 10px',
                  color: modalColor,
                  top: '30px',
                  bottom: '10px',
                  right: '10px',
                  left: '10px',
                },
              }}
              isOpen={this.state.modalOpen}
              onRequestClose={() => {
                this.setState({ modalOpen: false });
              }}
            >
              <FontAwesomeIcon
                onClick={() => {
                  this.setState({ modalOpen: false });
                }}
                icon={faTimes}
                style={{
                  position: 'fixed',
                  top: '0',
                  right: '0',
                  height: '28px',
                  width: '28px',
                  margin: '2px 5px 2px 0',
                  cursor: 'pointer',
                }}
              />
              <div>
                <ChapterImage url={this.state.currentImage} />
              </div>
            </Modal>
          </div>
        ) : (
          <ErrorMessage renderList={this.fetchData} />
        )}
      </div>
    );
  }
}

export default withRouter(ChapterPage);
