import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AppName from '../../components/js/AppName.js';
import localForage from 'localforage';
import { confirmAlert } from 'react-confirm-alert';
import Logo from '../../assets/logo.png';
import { Link, withRouter } from 'react-router-dom';
import '../css/NavBar.css';

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      signedIn: false,
    };
  }

  componentDidMount() {
    //check if user is signed in
    localForage
      .getItem('user')
      .then((value) => {
        if (value !== null) {
          this.setState({ signedIn: value.signedIn });
        } else this.setState({ signedIn: false });
      })
      .catch((err) => console.log(err));
  }

  signOut = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirm-logout' onClick={onClose}>
            <div
              className='confirm-logout-inner'
              onClick={(e) => e.stopPropagation()}
            >
              <img src={Logo} alt='MangaHaven logo' />
              <h3>Log out of MangaHaven?</h3>
              <p>
                You can log back in at anytime or create a new account by
                heading to the profile section.
              </p>
              <div className='action-buttons'>
                <button className='cancel-button' onClick={onClose}>
                  Cancel
                </button>
                <button
                  className='logout-button'
                  onClick={() => {
                    localForage
                      .removeItem('user')
                      .then((value) => {
                        onClose();
                        window.location.reload();
                      })
                      .catch((err) => console.log(err));
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };

  render() {
    const { page } = this.props;
    return (
      <div
        className='navigation-outer'
        onClick={(e) => {
          document
            .querySelector('.navigation')
            .classList.toggle('slide-out-left');
          document
            .querySelector('.navigation')
            .classList.toggle('slide-in-left');
          document.querySelector('html').classList.toggle('prevent-scroll');
          setTimeout(function () {
            document
              .querySelector('.navigation-outer')
              .classList.toggle('unhide');
          }, 500);
        }}
      >
        <div className='navigation' onClick={(e) => e.stopPropagation()}>
          <div className='navigation-inner'>
            <div className='nav-heading'>
              <AppName />
              <FontAwesomeIcon
                icon={faTimes}
                onClick={(e) => {
                  document
                    .querySelector('.navigation')
                    .classList.toggle('slide-out-left');
                  document
                    .querySelector('.navigation')
                    .classList.toggle('slide-in-left');
                  document
                    .querySelector('html')
                    .classList.toggle('prevent-scroll');
                  setTimeout(function () {
                    document
                      .querySelector('.navigation-outer')
                      .classList.toggle('unhide');
                  }, 500);
                }}
              />
            </div>
            <div className='navbar-links'>
              <Link
                to='/'
                className={
                  page === 'explore' ? 'active-window' : 'allmanga-link'
                }
              >
                <FontAwesomeIcon icon={faBook} />
                <span>Explore</span>
              </Link>
              <Link
                to='/recent'
                className={page === 'recent' ? 'active-window' : 'updated-link'}
              >
                <FontAwesomeIcon icon={faBookOpen} />
                <span>Recently Updated</span>
              </Link>
              <Link
                to='/all-genres'
                className={
                  page === 'all-genre' ? 'active-window' : 'genre-link'
                }
              >
                <FontAwesomeIcon icon={faColumns} />
                <span>All Genres</span>
              </Link>
              <Link
                to='/library'
                className={
                  page === 'library' ? 'active-window' : 'library-link'
                }
              >
                <FontAwesomeIcon icon={faBookmark} />
                <span>My Library</span>
              </Link>
              <Link
                to='/library-updates'
                className={
                  page === 'lib-update' ? 'active-window' : 'library-link'
                }
              >
                <FontAwesomeIcon icon={faBell} />
                <span>Library Updates</span>
              </Link>
              <Link
                to='/favorites'
                className={
                  page === 'favorite' ? 'active-window' : 'favorites-link'
                }
              >
                <FontAwesomeIcon icon={faHeart} />
                <span>Favorites</span>
              </Link>
              <Link
                to='/history'
                className={
                  page === 'history' ? 'active-window' : 'history-link'
                }
              >
                <FontAwesomeIcon icon={faHistory} />
                <span>History</span>
              </Link>
              {/* <Link
                to='/profile'
                className={
                  page === 'profile' ? 'active-window' : 'profile-link'
                }
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Profile</span>
              </Link> */}
              <span className='nav-breakline'></span>
              <Link
                to='/settings'
                className={
                  page === 'settings' ? 'active-window' : 'settings-link'
                }
              >
                <FontAwesomeIcon icon={faCog} />
                <span>Settings</span>
              </Link>
              {!this.state.signedIn ? null : (
                <button className='logout-button' onClick={this.signOut}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NavBar);
