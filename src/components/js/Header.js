import React from 'react';
import Hamburger from './Hamburger.js';
import SearchButton from './SearchButton.js';
import BackButton from './BackButton.js';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../css/Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchActive: false,
      searchInput: '',
      onSearchPage: false,
      searchManga: null,
    };
  }

  componentDidMount() {
    this.setState({
      onSearchPage: this.props.onSearchPage,
      searchActive: this.props.onSearchPage,
      searchManga: this.props.manga,
    });
    if (this.props.onSearchPage)
      this.setState({ searchInput: this.props.input });
  }

  onInputChange = (e) => {
    let input = e.target.value;
    if (this.props.onSearchPage && input.length >= 3)
      this.displaySearchResults(input);

    this.setState({ searchInput: input });
  };

  toggleSearch = () => {
    this.setState({ searchActive: !this.state.searchActive });
  };

  onSearchClick = () => {
    if (!this.state.searchActive) this.setState({ searchActive: true });
    else {
      if (this.state.searchInput !== '')
        this.displaySearchResults(this.state.searchInput);
    }
  };

  clearText = () => {
    const { localSearch, searchManga } = this.props;
    this.setState({ searchInput: '' });
    if (localSearch) searchManga('');
  };

  keyEvents = (e) => {
    let searchInput = e.target.value;
    if (searchInput !== '') {
      //for running search function
      if (e.key === 'Enter') this.displaySearchResults(this.state.searchInput);
    }
  };

  displaySearchResults = (input) => {
    if (this.props.onSearchPage) {
      this.props.history.push(`/search?q=${input.replace(/ /g, '+')}`);
      this.props.displayManga();
    } else {
      sessionStorage['prevPath'] = window.location.pathname;
      this.props.history.push(`/search?q=${input.replace(/ /g, '+')}`);
    }
  };

  goToPrevPath = () => {
    this.props.history.push(sessionStorage['prevPath']);
  };

  render() {
    const { onSearchPage, searchActive, searchInput } = this.state;
    const { currentMenu, localSearch, searchManga } = this.props;
    return (
      <div className='header'>
        <div
          className={
            searchActive ? 'inactive header-title' : 'active header-title'
          }
          id={onSearchPage ? 'on-search-page' : ''}
        >
          <Hamburger />
          <p className='current-menu'>{currentMenu}</p>
        </div>
        <div
          className={searchActive ? 'active search-box' : 'inactive search-box'}
        >
          <BackButton
            clickAction={onSearchPage ? this.goToPrevPath : this.toggleSearch}
          />
          {!localSearch ? (
            <input
              className='search-input'
              placeholder='Search...'
              type='text'
              onChange={this.onInputChange}
              value={searchInput}
              onKeyDown={this.keyEvents}
            />
          ) : (
            <input
              className='search-input'
              placeholder='Search...'
              type='text'
              onChange={(e) => {
                let searchInput = e.target.value;
                this.setState({ searchInput });
                searchManga(searchInput);
              }}
              value={searchInput}
            />
          )}
        </div>
        <div
          className={
            searchInput !== '' && searchActive
              ? 'active-state clear-button'
              : 'inactive clear-button'
          }
          onClick={this.clearText}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
        {!this.props.onHistoryPage ? (
          searchActive && localSearch ? null : (
            <SearchButton toggleSearch={this.onSearchClick} />
          )
        ) : null}
      </div>
    );
  }
}

export default withRouter(Header);
