import React from 'react';
import MangaCard from './MangaCard.js';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import '../css/CategoryBox.css';

const MenuItem = ({ text }) => {
  	return (
	  		<div className={`menu-item`}>
	    		{text}
	    	</div>
    	)
};

const Menu = (category) => {
	return category.map((manga, i) => {
		return (
				<MenuItem 
					text={
							<MangaCard 
								imageUrl={`https://cdn.mangaeden.com/mangasimg/${manga.im}`} 
								key={i} 
								mangaTitle={manga.t} 
								id={manga.i} 
								alias={manga.a} 
							/>
						} 
					key={i} 
				/>
		);
	})
}

class CategoryBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 5,
			menu: Menu(this.props.category.manga.slice(0, 5))
		}
	}
	
	loadItems = () => {
		if (this.props.category.manga.length >= this.state.count) {
			this.setState({ 
				count: this.state.count + 5,
				menu: Menu(this.props.category.manga.slice(0, this.state.count)) 
			})
		}
	}

	render() {	
		const { history } = this.props;
		const { category } = this.props.category;
		return (
				<div className='category'>
					<div 
						className='category-header'
						onClick={() => history.push(`/genre/${category.toLowerCase()}`)}
					>
						<p className='category-name'>{category}</p>
						<FontAwesomeIcon icon={faLongArrowAltRight} />
					</div>
					<ScrollMenu
						data={this.state.menu}
						arrowLeft={<FontAwesomeIcon icon={faChevronLeft} />}
						arrowRight={<FontAwesomeIcon icon={faChevronRight} />}
						hideArrows={true}
						hideSingleArrow={true}
						transition={0.5}
						alignCenter={false}
						onLastItemVisible={this.loadItems}
					/>
				</div>
			)
	}
}

export default withRouter(CategoryBox);