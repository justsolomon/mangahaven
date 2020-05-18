import React from 'react';
import '../css/Loader.css';
import LoaderGif from '../../assets/loader.gif';

const Loader = () => {
	return (
			<div className='loader-gif'>
				<img src={LoaderGif} alt='loader gif' />
			</div>
		)
}

export default Loader;