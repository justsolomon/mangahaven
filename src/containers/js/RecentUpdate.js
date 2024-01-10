import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../components/js/Loader.js';
import ErrorMessage from '../../components/js/ErrorMessage.js';
import { Helmet } from 'react-helmet';
import { API_BASE_URL } from '../../utils/config.js';

class RecentUpdate extends React.Component {
  constructor() {
    super();
    this.state = {
      allManga: [],
      displayedManga: [],
      count: 10,
      hasMoreItems: true,
    };
  }

  componentDidMount() {
    this.fetchManga();
  }

  displayManga = () => {
    if (this.state.allManga.length >= this.state.count) {
      this.setState({
        count: this.state.count + 10, //increase back to 100
        displayedManga: this.state.allManga.slice(0, this.state.count),
      });
    }
  };

  fetchManga = () => {
    if (this.state.allManga === null) {
      this.setState({
        allManga: [],
        hasMoreItems: true,
      });
    }

    fetch(`${API_BASE_URL}/recent`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ allManga: data });
        this.displayManga();
      })
      .catch((err) => {
        this.setState({
          allManga: null,
          hasMoreItems: false,
        });
      });
  };

  render() {
    const renderedContent =
      this.state.allManga === null ? (
        <ErrorMessage renderList={this.fetchManga} />
      ) : (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.displayManga.bind(this)}
          hasMore={this.state.hasMoreItems}
          loader={<Loader key={0} />}
        >
          <MangaCardList mangaArray={this.state.displayedManga} />
        </InfiniteScroll>
      );
    return (
      <div className='recent'>
        <Helmet>
          <title>Recently Updated Manga - MangaHaven</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header currentMenu='Recently Updated' onSearchPage={false} />
        <NavBar page='recent' />
        {renderedContent}
      </div>
    );
  }
}

export default RecentUpdate;
