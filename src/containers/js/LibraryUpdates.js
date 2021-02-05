import React from 'react';
import localForage from 'localforage';
import Header from '../../components/js/Header.js';
import NavBar from './NavBar.js';

class LibraryUpdates extends React.Component {
  constructor() {
    super();
    this.state = {
      chapterUpdates: [],
      noUpdate: '',
    };
  }

  componentDidMount() {
    localForage
      .getItem('library-updates')
      .then((value) => {
        this.setState({ chapterUpdates: value });
      })
      .catch(console.log);

    localForage.getItem('userBookmarks').then((value) => {
      if (value === null || value === []) {
        this.setState({
          chapterUpdates: null,
          noUpdate: 'There are no manga in your library',
        });
      }
    });
    localForage.getItem('offlineManga').then(console.log);
  }

  render() {
    // const { chapterUpdates } = this.state;
    return (
      <div className='library-updates'>
        <Header currentMenu='Library Updates' onHistoryPage={true} />
        <NavBar page='lib-update' />
        <p className='no-bookmarks'>Feature coming soon</p>
        {/* {chapterUpdates === null ? (
          <div className='no-library-updates'>
            <p>No updates</p>
          </div>
        ) : (
          <p>Updates available</p>
        )} */}
      </div>
    );
  }
}

export default LibraryUpdates;
