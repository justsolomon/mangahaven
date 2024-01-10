import React from 'react';
import Header from '../../components/js/Header.js';
import Loader from '../../components/js/Loader.js';
import CategoryList from '../../components/js/CategoryList.js';
import ErrorMessage from '../../components/js/ErrorMessage.js';
import NavBar from './NavBar.js';
import { Helmet } from 'react-helmet';
import { API_BASE_URL } from '../../utils/config.js';
import '../css/Categories.css';

class Categories extends React.Component {
  constructor() {
    super();
    this.state = {
      categoryManga: [],
      loader: true,
    };
  }

  componentDidMount() {
    this.loadManga();
  }

  loadManga = () => {
    if (this.state.categoryManga === null) {
      this.setState({
        categoryManga: [],
        loader: true,
      });
    }

    fetch(`${API_BASE_URL}/all-genres`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          categoryManga: data,
          loader: false,
        });
      })
      .catch((err) => {
        this.setState({
          categoryManga: null,
          loader: false,
        });
      });
  };

  render() {
    const renderedContent =
      this.state.categoryManga === null ? (
        <ErrorMessage renderList={this.loadManga} />
      ) : (
        <CategoryList categoryManga={this.state.categoryManga} />
      );

    const loader = this.state.loader ? <Loader /> : null;

    return (
      <div className='categories'>
        <Helmet>
          <title>All Genres Manga - MangaHaven</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <Header currentMenu='All Genres' onSearchPage={false} />
        <NavBar page='all-genre' />
        {loader}
        {renderedContent}
      </div>
    );
  }
}

export default Categories;
