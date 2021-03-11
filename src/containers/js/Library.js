import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import { Helmet } from 'react-helmet';
import localForage from 'localforage';

class Library extends React.Component {
  constructor() {
    super();
    this.state = {
      library: [],
      displayedManga: [],
    };
  }

  componentDidMount() {
    //check if user bookmarks exists in storage
    localForage
      .getItem('userBookmarks')
      .then((value) => {
        if (value !== null) value.reverse();
        this.setState({
          library: value,
          displayedManga: value,
        });
      })
      .catch((err) => console.log(err));
  }

  filterManga = (keyword) => {
    let { library, displayedManga } = this.state;

    displayedManga = library.filter((manga) => {
      const regex = new RegExp(keyword, 'gi');
      return manga.name.match(regex) || manga.alias.match(regex);
    });
    this.setState({ displayedManga });
  };

  render() {
    const { library, displayedManga } = this.state;
    return (
      <div className='manga-library'>
        <Helmet>
          <title>Library - MangaHaven</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header
          currentMenu={'Library'}
          localSearch={true}
          searchManga={this.filterManga}
        />
        <NavBar page='library' />
        {library === null ? (
          <p className='no-bookmarks'>
            You don't have any bookmarked manga yet
          </p>
        ) : (
          <MangaCardList mangaArray={displayedManga} bookmark />
        )}
      </div>
    );
  }
}

export default Library;
