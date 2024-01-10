import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../components/js/Loader.js';
import { Helmet } from 'react-helmet';
import { API_BASE_URL } from '../../utils/config.js';
import ErrorMessage from '../../components/js/ErrorMessage.js';

class ExplorePage extends React.Component {
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
    this.setState({ hasMoreItems: true });
    this.loadManga();
    console.log(this.state.hasMoreItems);
  }

  displayManga = () => {
    if (this.state.allManga.length >= this.state.count) {
      this.setState({
        count: this.state.count + 10, //increase back to 100
        displayedManga: this.state.allManga.slice(0, this.state.count),
      });
    } else {
      this.setState({ hasMoreItems: false });
    }
  };

  loadManga = () => {
    if (this.state.allManga === null) {
      this.setState({
        allManga: [],
        hasMoreItems: true,
      });
    }

    fetch(`${API_BASE_URL}/hot`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          allManga: data,
          hasMoreItems: true,
        });
        console.log(this.state.hasMoreItems);

        this.displayManga();
      })
      .catch((err) => {
        this.setState({ hasMoreItems: false });
        setTimeout(() => this.setState({ hasMoreItems: true }), 1000);
      });
  };

  render() {
    const { allManga, displayedManga, hasMoreItems } = this.state;

    const renderedContent =
      allManga === null ? (
        <ErrorMessage renderList={this.loadManga} />
      ) : (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.displayManga.bind(this)}
          hasMore={hasMoreItems}
          loader={<Loader key={0} />}
        >
          <MangaCardList mangaArray={displayedManga} />
          <Loader />
        </InfiniteScroll>
      );
    return (
      <div className='explore-page'>
        <Helmet>
          <title>Explore - MangaHaven</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header currentMenu='Explore' onSearchPage={false} />
        <NavBar page='explore' />
        {renderedContent}
      </div>
    );
  }
}

export default ExplorePage;
