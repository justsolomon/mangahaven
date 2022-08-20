import React from 'react';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import UserProfile from './UserProfile.js';
import ExplorePage from './ExplorePage.js';
import RecentUpdate from './RecentUpdate.js';
import Categories from './Categories.js';
import MangaPage from './MangaPage.js';
import CategoryPage from './CategoryPage.js';
import SearchResults from './SearchResults.js';
import Favorites from './Favorites.js';
import Library from './Library.js';
import LibraryUpdates from './LibraryUpdates.js';
import Settings from './Settings.js';
import ChapterPage from './ChapterPage.js';
import HistoryPage from './HistoryPage.js';
import EditProfile from './EditProfile.js';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import '../css/App.css';
import { confirmAlert } from 'react-confirm-alert';
import Logo from '../../assets/logo.png';

class App extends React.Component {
//   componentDidMount() {
//     let noticeShown = sessionStorage['notice'];

//     if (!noticeShown) {
//       this.showNotice();
//       sessionStorage['notice'] = true;
//     }
//   }

  showNotice = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirm-logout' onClick={onClose}>
            <div
              className='confirm-logout-inner'
              onClick={(e) => e.stopPropagation()}
            >
              <img src={Logo} alt='MangaHaven logo' />
              <h3>Important Notice</h3>
              <p>
                Due to the API we were previously using being taken down, some
                of the site's features are currently not functioning. Please
                bear with us as we are working on getting a replacement up as
                soon as we can.
              </p>
              <div
                className='action-buttons'
                style={{ justifyContent: 'flex-end' }}
              >
                <button className='logout-button' onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };

  render() {
    return (
      <div className='App'>
        <Router>
          <Route exact path='/' component={ExplorePage} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/profile' component={UserProfile} />
          <Route path='/explore'>
            <Redirect to='/' />
          </Route>
          <Route path='/recent' component={RecentUpdate} />
          <Route path='/search' component={SearchResults} />
          <Route path='/favorites' component={Favorites} />
          <Route path='/library' component={Library} />
          <Route path='/library-updates' component={LibraryUpdates} />
          <Route path='/settings' component={Settings} />
          <Route path='/history' component={HistoryPage} />
          <Route path='/all-genres' component={Categories} />
          <Route path='/edit-profile' component={EditProfile} />
          <Route path='/genre/:name' component={CategoryPage} />
          <Route path='/manga/:name' component={MangaPage} />
          <Route
            path='/read/:mangaName/chapter/:chapterNum/'
            component={ChapterPage}
          />
        </Router>
      </div>
    );
  }
}

export default App;
