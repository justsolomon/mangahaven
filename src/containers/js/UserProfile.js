import React from 'react';
import MiniHeader from '../../components/js/MiniHeader.js';
import '../css/UserProfile.css';
import Loader from '../../components/js/Loader.js';
import localForage from 'localforage';
import NavBar from './NavBar.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faVenusMars } from '@fortawesome/free-solid-svg-icons';
import Image from '../../components/js/Image.js';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SecureLS from 'secure-ls';

class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: true,
      userData: {},
      social: {},
      joined: '',
    };
  }

  componentDidMount() {
    console.log(this.props);
    //check if user is signed in
    localForage
      .getItem('user')
      .then((value) => {
        if (value !== null) {
          if (value.signedIn) {
            //fetch user profile from db
            const ls = new SecureLS();
            let token = ls.get('userToken');
            fetch(
              'https://mangahaven-server.netlify.app/.netlify/functions/app/profile',
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: token,
                },
              }
            )
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                //replace default avatar with retro
                data.user.avatar = data.user.avatar.replace('d=mm', 'd=retro');

                //replace data.social with empty object to prevent errors when destructuring
                if (data.social === undefined) data.social = {};
                this.setState({
                  redirect: false,
                  userData: { ...data, ...data.user },
                  social: data.social,
                  joined: new Date(data.date),
                });
              })
              .catch((err) => {
                //replace value.social with empty object to prevent errors when destructuring
                if (value.social === undefined) value.social = {};

                //replace default avatar with retro
                value.avatar = value.avatar.replace('d=mm', 'd=retro');

                //display user info from webstorage in case of error
                this.setState({
                  redirect: false,
                  userData: value,
                  social: value.social,
                  joined: new Date(value.dateJoined),
                });
              });
          } else this.props.history.push('/signin');
        } else {
          this.props.history.push('/signin');
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { redirect, joined } = this.state;
    const {
      name,
      avatar,
      bio,
      email,
      location,
      gender,
      date_of_birth,
    } = this.state.userData;
    const { twitter, facebook } = this.state.social;
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return (
      <div className='user-profile'>
        <Helmet>
          <title>{`${name} - MangaHaven`}</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <NavBar page='profile' />
        <MiniHeader currentMenu={redirect ? 'Profile' : name} />
        {redirect ? (
          <Loader />
        ) : (
          <div className='profile-details'>
            <div className='profile-header'>
              <div className='profile-pic'>
                <Image url={avatar} title='User profile pic' />
              </div>
              <div className='user-action'>
                <p className='username'>{name}</p>
                <button
                  className='edit-button'
                  onClick={() => this.props.history.push('/edit-profile')}
                >
                  Edit profile
                </button>
              </div>
            </div>
            <div className='profile-info'>
              {bio !== undefined && bio !== '' ? (
                <p className='user-bio'>{bio}</p>
              ) : null}
              <div className='section email-section'>
                <div className='icon'>
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <p>{email}</p>
              </div>
              <div className='section-list'>
                <div className='section'>
                  <div className='icon'>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <p>{`Joined ${
                    months[joined.getMonth()]
                  } ${joined.getFullYear()}`}</p>
                </div>
                {location !== undefined && location !== '' ? (
                  <div className='section'>
                    <div className='icon'>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <p>{location}</p>
                  </div>
                ) : null}
                {gender !== undefined && gender !== '' ? (
                  <div className='section'>
                    <div className='icon'>
                      <FontAwesomeIcon icon={faVenusMars} />
                    </div>
                    <p>{gender}</p>
                  </div>
                ) : null}
                {date_of_birth !== undefined && date_of_birth !== '' ? (
                  <div className='section'>
                    <div className='icon'>
                      <FontAwesomeIcon icon={faBirthdayCake} />
                    </div>
                    <p>{`Born ${
                      months[new Date(date_of_birth).getMonth()]
                    } ${new Date(date_of_birth).getFullYear()}`}</p>
                  </div>
                ) : null}
                {twitter !== undefined && twitter !== '' ? (
                  <div className='section'>
                    <div className='icon'>
                      <FontAwesomeIcon icon={faTwitter} />
                    </div>
                    <a
                      href={twitter}
                      target='_blank'
                      rel='noopener noreferrer'
                    >{`@${twitter.replace('https://twitter.com/', '')}`}</a>
                  </div>
                ) : null}
                {facebook !== undefined && facebook !== '' ? (
                  <div className='section'>
                    <div className='icon'>
                      <FontAwesomeIcon icon={faFacebook} />
                    </div>
                    <a
                      href={facebook}
                      target='_blank'
                      rel='noopener noreferrer'
                    >{`@${facebook.replace('https://facebook.com/', '')}`}</a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(UserProfile);
