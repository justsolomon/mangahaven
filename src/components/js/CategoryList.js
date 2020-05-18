import React from 'react';
import LazyLoad from 'react-lazyload';
import Loader from './Loader.js';
import CategoryBox from './CategoryBox.js';

const CategoryList = ({ categoryManga }) => {
	return (
			<div className='category-list'>
				{
					categoryManga.map((categ, i) => {
						return (
							<LazyLoad
								key={i}  
								once={true} 
								height={400} 
								offset={[-50, 50]} 
								placeholder={<Loader />}
							>
								<CategoryBox category={categ} key={i} />
							</LazyLoad>
						)
					})
				}
			</div>
		)
}

export default CategoryList;