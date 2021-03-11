import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import localForage from 'localforage';
import { Helmet } from 'react-helmet';

class Favorites extends React.Component {
  constructor() {
    super();
    this.state = {
      userFav: [],
      displayedManga: [],
    };
  }

  componentDidMount() {
    //check if user favorites exists in storage
    localForage
      .getItem('userFavorites')
      .then((value) => {
        if (value !== null) value.reverse();
        this.setState({
          userFav: value,
          displayedManga: value,
        });
      })
      .catch((err) => console.log(err));
  }

  filterManga = (keyword) => {
    let { userFav, displayedManga } = this.state;

    displayedManga = userFav.filter((manga) => {
      const regex = new RegExp(keyword, 'gi');
      return manga.name.match(regex) || manga.alias.match(regex);
    });
    this.setState({ displayedManga });
  };

  render() {
    const { userFav, displayedManga } = this.state;
    return (
      <div className='favorite-manga'>
        <Helmet>
          <title>Favorites - MangaHaven</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header
          currentMenu={'Favorites'}
          localSearch={true}
          searchManga={this.filterManga}
        />
        <NavBar page='favorite' />
        {userFav === null ? (
          <p className='no-bookmarks'>You don't have any favorited manga yet</p>
        ) : (
          <MangaCardList mangaArray={displayedManga} bookmark />
        )}
      </div>
    );
  }
}

export default Favorites;
