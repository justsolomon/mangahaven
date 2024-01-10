import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import InfiniteScroll from 'react-infinite-scroller';
import ErrorMessage from '../../components/js/ErrorMessage.js';
import Loader from '../../components/js/Loader.js';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/config.js';

class CategoryPage extends React.Component {
  constructor() {
    super();
    this.state = {
      manga: [],
      displayedManga: [],
      count: 10,
      hasMoreItems: true,
    };
  }

  componentDidMount() {
    this.fetchManga();
  }

  displayManga = () => {
    if (this.state.manga.length >= this.state.count) {
      this.setState({
        count: this.state.count + 10, //increase back to 100 during production
        displayedManga: this.state.manga.slice(0, this.state.count),
      });
    }
  };

  fetchManga = () => {
    if (this.state.manga === null) {
      this.setState({
        manga: [],
        hasMoreItems: true,
      });
    }

    const genre = this.props.match.params.name;
    fetch(`${API_BASE_URL}/genre/${genre}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ manga: data });
        this.displayManga();
      })
      .catch((err) => {
        this.setState({
          manga: null,
          hasMoreItems: false,
        });
      });
  };

  render() {
    const genre = this.props.match.params.name;
    const renderedContent =
      this.state.manga === null ? (
        <ErrorMessage renderList={this.loadManga} />
      ) : (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.displayManga.bind(this)}
          hasMore={this.state.hasMoreItems}
          loader={<Loader key={0} />}
        >
          <MangaCardList mangaArray={this.state.displayedManga} genre />
        </InfiniteScroll>
      );

    return (
      <div className={genre}>
        <Helmet>
          <title>{`${genre} Manga - MangaHaven`}</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header currentMenu={genre} onSearchPage={false} />
        <NavBar />
        {renderedContent}
      </div>
    );
  }
}

export default withRouter(CategoryPage);
