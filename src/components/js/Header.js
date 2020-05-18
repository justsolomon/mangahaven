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
			clearText: false,
			onSearchPage: false,
			searchManga: null
		}
	}

	componentDidMount() {
		this.setState({
			onSearchPage: this.props.onSearchPage, 
			searchActive: this.props.onSearchPage,
			searchManga: this.props.manga
		})
		if (this.props.onSearchPage) this.setState({ searchInput: this.props.input })
	}

	onInputChange = (e) => {
		let input = e.target.value;
		if (this.props.onSearchPage && input.length >= 3) this.displaySearchResults(input);
		
		if (input !== '') {
			this.setState({ 
				searchInput: input,
				clearText: true 
			});
		} else this.setState({ clearText: false })
	}

	toggleSearch = () => {
		this.setState({ searchActive: !this.state.searchActive })
	}

	onSearchClick = () => {
		if (!this.state.searchActive) this.setState({ searchActive: true });
		else {
			if (this.state.searchInput !== '') this.displaySearchResults(this.state.searchInput);
		}
	}

	clearText = () => {
		this.setState({
			searchInput: ''
		})
	}

	keyEvents = (e) => {
		let searchInput = e.target.value;
		if (searchInput !== '') {	
			//for backspace
			if (e.key === 'Backspace') {
				e.preventDefault();
				searchInput = searchInput.slice(0, searchInput.length - 1);
				this.setState({ searchInput });
			}
			//for running search function
			else if (e.key === 'Enter') this.displaySearchResults(this.state.searchInput);
		}
	}

	displaySearchResults = (input) => {
		if (this.props.onSearchPage) {
			this.props.history.push(`/search?q=${input.replace(/ /g, '+')}`);
			this.props.displayManga();
		} else {
			sessionStorage['prevPath'] = window.location.pathname;
			this.props.history.push(`/search?q=${input.replace(/ /g, '+')}`)
		};
	}

	goToPrevPath = () => {
		this.props.history.push(sessionStorage['prevPath']);
	}

	render() {	
		const { onSearchPage } = this.state;
		return (
				<div className='header'>
					<div 
						className={this.state.searchActive ? 'inactive header-title' : 'active header-title'}
						id={onSearchPage ? 'on-search-page' : '' }
					>
						<Hamburger />
						<p className='current-menu'>{this.props.currentMenu}</p>
					</div>
					<div className={this.state.searchActive ? 'active search-box' : 'inactive search-box'}>
						<BackButton 
							toggleSearch={onSearchPage ? this.goToPrevPath : this.toggleSearch}
						/>	
						<input 
							className='search-input' 
							placeholder='Search...' 
							type='text'
							onChange={this.onInputChange}
							value={this.state.searchInput}
							onKeyDown={this.keyEvents}
						/>				
					</div>
					<div 
						className={(this.state.searchInput !== '') ?
									'active-state clear-button' : 
									'inactive clear-button'
									}
						onClick={this.clearText}
					>
						<FontAwesomeIcon icon={faTimes} />
					</div>
					<SearchButton toggleSearch={this.onSearchClick} />
				</div>
			)
	}
}

export default withRouter(Header);