import React from 'react';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';
import MangaCardList from '../../components/js/MangaCardList.js';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../components/js/Loader.js';
import ErrorMessage from '../../components/js/ErrorMessage.js';
import { Helmet } from 'react-helmet';
import { API_BASE_URL } from '../../utils/config.js';
import '../css/SearchResults.css';

class SearchResults extends React.Component {
  constructor() {
    super();
    this.state = {
      allManga: [],
      searchResults: [],
      displayedManga: [],
      hasMoreItems: true,
      count: 10,
      loader: true,
      noResult: false,
    };
  }

  componentDidMount() {
    this.fetchAllManga();
  }

  fetchAllManga = () => {
    fetch(`${API_BASE_URL}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ allManga: data });
        this.displayManga(this.setInput());
        console.log(data.manga);
      })
      .catch((err) => {
        this.setState({
          allManga: null,
          loader: false,
        });
      });
  };

  reFetchManga = () => {
    this.setState({
      allManga: [],
      loader: true,
    });
    this.fetchAllManga();
  };

  displayManga = (input) => {
    let searchResults = this.searchManga(input, this.state.allManga);
    if (searchResults.length === 0) {
      this.setState({
        noResult: true,
        loader: false,
      });
      return;
    }

    if (searchResults.length <= 10) {
      this.setState({
        searchResults,
        displayedManga: searchResults,
        hasMoreItems: false,
        loader: false,
        noResult: false,
      });
    } else {
      this.setState({
        searchResults,
        hasMoreItems: true,
        loader: false,
        noResult: false,
      });
    }
  };

  displayMore = () => {
    if (this.state.searchResults.length >= this.state.count) {
      this.setState({
        count: this.state.count + 10,
        displayedManga: this.state.searchResults.slice(0, this.state.count),
      });
    } else this.setState({ hasMoreItems: false });
  };

  searchManga = (wordToMatch, allManga) => {
    //filter out city objects matching search term
    return allManga.filter((manga) => {
      const regex = new RegExp(wordToMatch, 'gi');
      for (let i = 0; i < manga.al.length; i++) {
        if (manga.al[i].match(regex)) return true;
      }
      return manga.s.match(regex) || manga.i.match(regex);
    });
  };

  newSearch = () => {
    if (this.state.allManga !== null) this.displayManga(this.setInput());
  };

  setInput = () => {
    const url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get('q').trim();
  };

  render() {
    const contentBody = this.state.noResult ? (
      <p className='no-results'>
        Sorry, no results were found for <span>'{this.setInput()}'</span>
      </p>
    ) : (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.displayMore.bind(this)}
        hasMore={this.state.hasMoreItems}
      >
        <MangaCardList mangaArray={this.state.displayedManga} search />
      </InfiniteScroll>
    );

    const renderedContent =
      this.state.allManga === null ? (
        <ErrorMessage renderList={this.reFetchManga} />
      ) : (
        contentBody
      );

    const loader = this.state.loader ? <Loader /> : null;

    return (
      <div className='explore-page'>
        <Helmet>
          <title>{`Search results for '${this.setInput()}' - MangaHaven`}</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header
          currentMenu='Explore'
          onSearchPage={true}
          displayManga={this.newSearch}
          input={this.setInput().replace(/[+]/g, ' ')}
        />
        <NavBar />
        {loader}
        {renderedContent}
      </div>
    );
  }
}

export default SearchResults;
