import React from 'react';
import Loader from '../../assets/image-loader.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

class AuthDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      pwHidden: true,
      pwTwoHidden: true,
    };
  }

  hidePw = () => this.setState({ pwHidden: true });

  showPw = () => this.setState({ pwHidden: false });

  hidePwTwo = () => this.setState({ pwTwoHidden: true });

  showPwTwo = () => this.setState({ pwTwoHidden: false });

  render() {
    const {
      value,
      loader,
      updateEmail,
      updatePassword,
      updatePasswordTwo,
      hideControl,
      hideControlTwo,
    } = this.props;
    const { pwHidden, pwTwoHidden } = this.state;
    return (
      <div className='auth-details'>
        <label htmlFor='email'>
          <p>Email Address</p>
          <input
            type='email'
            id='email'
            onChange={updateEmail}
            className='email-input'
            required
          />
        </label>
        <label htmlFor='password'>
          <p>Password</p>
          <input
            type={pwHidden ? 'password' : 'text'}
            id='password'
            onChange={updatePassword}
            className='password-input'
            minLength='6'
            maxLength='30'
            required
          />
          {hideControl ? null : pwHidden ? (
            <FontAwesomeIcon onClick={this.showPw} icon={faEye} />
          ) : (
            <FontAwesomeIcon onClick={this.hidePw} icon={faEyeSlash} />
          )}
        </label>
        {value === 'Login' ? null : (
          <label htmlFor='confirm-password'>
            <p>Confirm Password</p>
            <input
              type={pwTwoHidden ? 'password' : 'text'}
              id='confirm-password'
              onChange={updatePasswordTwo}
              className='password-input'
              minLength='6'
              maxLength='30'
              required
            />
            {hideControlTwo ? null : pwTwoHidden ? (
              <FontAwesomeIcon onClick={this.showPwTwo} icon={faEye} />
            ) : (
              <FontAwesomeIcon onClick={this.hidePwTwo} icon={faEyeSlash} />
            )}
          </label>
        )}
        <label htmlFor='submit'>
          <button className='auth-button' id='submit'>
            {loader ? <img src={Loader} alt='loader' /> : null}
            {value}
          </button>
        </label>
      </div>
    );
  }
}

export default AuthDetails;
