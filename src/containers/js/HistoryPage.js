import React from 'react';
import localForage from 'localforage';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import Image from '../../components/js/Image.js';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import '../css/HistoryPage.css';

class HistoryPage extends React.Component {
  constructor() {
    super();
    this.state = {
      mangaHistory: [],
    };
  }

  componentDidMount() {
    localForage
      .getItem('readHistory')
      .then((manga) => {
        if (manga !== null) manga.sort((a, b) => b.added - a.added);
        console.log(manga);
        this.setState({ mangaHistory: manga });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { mangaHistory } = this.state;
    return (
      <div className='manga-history'>
        <Helmet>
          <title>History - MangaHaven</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header currentMenu='History' onHistoryPage={true} />
        <NavBar page='history' />
        {mangaHistory === null ? (
          <p className='no-manga-history'>You have no recently read manga</p>
        ) : (
          <div className='history-card-list'>
            {mangaHistory.map((manga, i) => {
              return (
                <div className='history-card' key={i}>
                  <div
                    className='card-image'
                    onClick={() =>
                      this.props.history.push(
                        `/manga/${manga.alias}/${manga.mangaId}`
                      )
                    }
                  >
                    <Image url={manga.image} title={manga.title} />
                  </div>
                  <div className='card-details'>
                    <div className='card-info'>
                      <p className='title'>{manga.title}</p>
                      <p className='chapter-info'>{`Chapter ${manga.chapterNum} - Page ${manga.page}`}</p>
                      <p className='date-added'>
                        <span>
                          {new Date(manga.added).toLocaleDateString()}
                        </span>
                        <span>
                          {new Date(manga.added).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                    <div className='action-buttons'>
                      <button
                        className='resume-button'
                        onClick={() =>
                          this.props.history.push(
                            `/read/${manga.alias}/chapter/${manga.chapterNum}?q=${manga.page}`
                          )
                        }
                      >
                        RESUME
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(HistoryPage);
