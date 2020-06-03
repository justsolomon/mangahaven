import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/logo.png';
import '../css/NavBar.css';

const NavBar = ({ page }) => {
		return (
				<div className='navigation-outer' onClick={e => {
					document.querySelector('.navigation').classList.toggle('slide-out-left');
		            document.querySelector('.navigation').classList.toggle('slide-in-left');
            		document.querySelector('html').classList.toggle('prevent-scroll');
		            setTimeout(function() {
		                document.querySelector('.navigation-outer').classList.toggle('unhide');
		            }, 500)
				}}>
					<div className='navigation' onClick={e => e.stopPropagation()}>
						<div className='navigation-inner'>
							<div className='nav-heading'>
								<div className='app-name'>
									<img src={Logo} />
									<p>MangaHaven</p>
								</div>
								<FontAwesomeIcon icon={faTimes} onClick={e => {
									document.querySelector('.navigation').classList.toggle('slide-out-left');
						            document.querySelector('.navigation').classList.toggle('slide-in-left');
				            		document.querySelector('html').classList.toggle('prevent-scroll');
						            setTimeout(function() {
						                document.querySelector('.navigation-outer').classList.toggle('unhide');
						            }, 500)
								}} />
							</div>
							<div className='navbar-links'>
								<a href='/' className={page === 'explore' ? 'active-window' : 'allmanga-link'}>
									<FontAwesomeIcon icon={faBook} />
									<span>Explore</span>
								</a>
								<a href='/recent' className={page === 'recent' ? 'active-window' : 'updated-link'}>
									<FontAwesomeIcon icon={faBookOpen} />
									<span>Recently Updated</span>
								</a>
								<a href='/all-genres' className={page === 'all-genre' ? 'active-window' : 'genre-link'}>
									<FontAwesomeIcon icon={faColumns} />
									<span>All Genres</span>
								</a>
								<a href='/library' className={page === 'library' ? 'active-window' : 'library-link'}>
									<FontAwesomeIcon icon={faBookmark} />
									<span>My Library</span>
								</a>
								<a href='/library-updates' className={page === 'lib-update' ? 'active-window' : 'library-link'}>
									<FontAwesomeIcon icon={faBell} />
									<span>Library Updates</span>
								</a>
								<a href='/favorites' className={page === 'favorite' ? 'active-window' : 'favorites-link'}>
									<FontAwesomeIcon icon={faHeart} />
									<span>Favorites</span>
								</a>
								<a href='/history' className={page === 'history' ? 'active-window' : 'history-link'}>
									<FontAwesomeIcon icon={faHistory} />
									<span>History</span>
								</a>
								<a href='/profiles' className='profile-link'>
									<FontAwesomeIcon icon={faUser} />
									<span>Profile</span>
								</a>
								<span className='nav-breakline'></span>
								<a href='/profiles' className='settings-link'>
									<FontAwesomeIcon icon={faCog} />
									<span>Settings</span>
								</a>
							</div>
							<div className='attribution'>
								<a href='https://www.mangaeden.com' target='_blank' rel='noopener noreferrer'>
									<span>Powered by Manga Eden</span>
									<FontAwesomeIcon icon={faExternalLinkAlt} />
								</a>
								<a href="https://www.designevo.com/logo-maker/" title="Free Online Logo Maker">
									<span>Logo made by DesignEvo free logo creator</span>
									<FontAwesomeIcon icon={faExternalLinkAlt} />
								</a>
							</div>
						</div>
					</div>
				</div>
			)
}

export default NavBar;