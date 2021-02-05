import React from 'react';
import MiniHeader from '../../components/js/MiniHeader.js';
import localForage from 'localforage';
import NavBar from './NavBar.js';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SecureLS from 'secure-ls';
import Loader from '../../assets/image-loader.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../css/EditProfile.css';

class EditProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      loader: false,
      location: '',
      bio: '',
      date_of_birth: '',
      gender: '',
      twitter: '',
      facebook: '',
      token: '',
      success: false,
      error: false,
    };
  }

  componentDidMount = () => {
    const ls = new SecureLS();
    const token = ls.get('userToken');
    this.setState({ token });

    //fetch existing user profile
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
        this.displayUserInfo(data);
      })
      .catch((err) => {
        //display info from web storage
        localForage
          .getItem('user')
          .then((value) => this.displayUserInfo(value))
          .catch((err) => console.log(err));
      });
  };

  updateInput = (target, value) => {
    this.setState({ [target]: value });
  };

  submitProfile = (e) => {
    e.preventDefault();
    this.setState({ loader: true });
    let {
      location,
      bio,
      date_of_birth,
      gender,
      twitter,
      facebook,
      token,
    } = this.state;

    if (twitter !== '') twitter = `https://twitter.com/${twitter}`;
    if (facebook !== '') facebook = `https://facebook.com/${facebook}`;
    //post details to db
    fetch(
      'https://mangahaven-server.netlify.app/.netlify/functions/app/profile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          location,
          bio,
          date_of_birth,
          gender,
          twitter,
          facebook,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          loader: false,
          success: true,
        });
        console.log(data);

        //save new profile details to web storage
        this.saveUserProfile(data);
      })
      .catch((err) => {
        this.setState({
          loader: false,
          success: true,
          error: true,
        });
      });
  };

  saveUserProfile = (user) => {
    localForage
      .getItem('user')
      .then((value) => {
        value.bio = user.bio;
        value.date_of_birth = user.date_of_birth;
        value.gender = user.gender;
        value.location = user.location;
        value.social = user.social;

        localForage.setItem('user', value).then(console.log).catch(console.log);
      })
      .catch(console.log);
  };

  displayUserInfo = (value) => {
    //get default values of profile social details
    let { twitter, facebook } = this.state;

    if (value.social !== undefined) {
      if (value.social.twitter)
        twitter = value.social.twitter.replace('https://twitter.com/', '');
      if (value.social.facebook)
        facebook = value.social.facebook.replace('https://facebook.com/', '');
    }

    let { location, bio, date_of_birth, gender } = value;

    //format dob to required format
    date_of_birth = date_of_birth.slice(0, date_of_birth.indexOf('T'));

    this.setState({
      location,
      bio,
      date_of_birth,
      gender,
      twitter,
      facebook,
    });
  };

  render() {
    const {
      location,
      bio,
      date_of_birth,
      gender,
      twitter,
      facebook,
      loader,
      success,
      error,
    } = this.state;
    const { updateInput, submitProfile } = this;
    return (
      <div className='profile-edit'>
        <Helmet>
          <title>{`Edit Profile - MangaHaven`}</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <NavBar />
        <MiniHeader currentMenu={'Edit Profile'} />
        {success ? (
          !error ? (
            <div className='message'>
              <p>Profile updated successfully</p>
              <div className='action-tags'>
                <p onClick={() => this.props.history.push('/profile')}>
                  View Profile
                </p>
                <FontAwesomeIcon
                  onClick={() => this.setState({ success: false })}
                  icon={faTimes}
                />
              </div>
            </div>
          ) : (
            <div className='message'>
              <p>An error occurred. Please try again</p>
              <FontAwesomeIcon
                onClick={() => this.setState({ success: false })}
                icon={faTimes}
              />
            </div>
          )
        ) : null}
        <form className='auth-form profile-form' onSubmit={submitProfile}>
          <label htmlFor='location'>
            <p>Location</p>
            <input
              onChange={(e) => updateInput('location', e.target.value)}
              type='text'
              id='location'
              defaultValue={location}
            />
          </label>
          <label htmlFor='bio'>
            <p>Bio</p>
            <textarea
              onChange={(e) => updateInput('bio', e.target.value)}
              id='bio'
              maxLength='160'
              defaultValue={bio}
            ></textarea>
          </label>
          <label htmlFor='twitter'>
            <p>Twitter Username</p>
            <input
              onChange={(e) => updateInput('twitter', e.target.value)}
              type='text'
              id='twitter'
              defaultValue={twitter}
            />
          </label>
          <label htmlFor='facebook'>
            <p>Facebook Username</p>
            <input
              onChange={(e) => updateInput('facebook', e.target.value)}
              type='text'
              id='facebook'
              defaultValue={facebook}
            />
          </label>
          <label htmlFor='dob'>
            <p>Date of Birth</p>
            <input
              onChange={(e) => updateInput('date_of_birth', e.target.value)}
              type='date'
              id='dob'
              defaultValue={date_of_birth}
            />
          </label>
          <label htmlFor='gender'>
            <p>Gender</p>
          </label>
          <select
            onChange={(e) => updateInput('gender', e.target.value)}
            name='gender'
            id='gender'
            className='gender-select'
            value={gender}
          >
            <option value=''>None chosen</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Other'>Other</option>
          </select>
          <label htmlFor='submit'>
            <button className='submit-button' id='submit'>
              {loader ? <img src={Loader} alt='loader' /> : null}
              <span>Update profile</span>
            </button>
          </label>
        </form>
      </div>
    );
  }
}

export default withRouter(EditProfile);
