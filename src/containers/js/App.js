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
import { Route, BrowserRouter as Router } from 'react-router-dom';
import '../css/App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
		<Router>
			<Route exact path='/' component={ExplorePage} />
			<Route path='/signin' component={SignIn} />
			<Route path='/signup' component={SignUp} />
			<Route path='/profile' component={UserProfile} />
			{/*<Route path='/explore' component={ExplorePage} />*/}
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
			<Route path='/manga/:name/:id' component={MangaPage} />
			<Route path='/:name/:mangaid/chapter/:number/:id' component={ChapterPage} />
		</Router>
      </div>
    );
  }
}

export default App;