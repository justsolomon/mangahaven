import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../css/Hamburger.css';

class Hamburger extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }

  displayNavbar = () => {
    if (this.state.count === 1)
      document.querySelector('.navigation').classList.toggle('slide-out-left');
    document.querySelector('.navigation-outer').classList.toggle('unhide');
    document.querySelector('.navigation').classList.toggle('slide-in-left');
    document.querySelector('html').classList.toggle('prevent-scroll');
    this.setState({ count: 1 });
  };

  render() {
    return (
      <div className='hamburger' onClick={this.displayNavbar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
    );
  }
}

export default Hamburger;
