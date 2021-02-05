import React from 'react';
import AuthDetails from '../../components/js/AuthDetails.js';
import AppName from '../../components/js/AppName.js';
import localForage from 'localforage';
import SecureLS from 'secure-ls';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      email: '',
      password: '',
      name: '',
      passwordTwo: '',
      errorMsg: '',
      controlHidden: true,
      controlTwoHidden: true,
    };
  }

  registerUser = (e) => {
    e.preventDefault();
    const { email, password, name, passwordTwo } = this.state;

    //check if password matches password two
    if (password !== passwordTwo) {
      this.setState({ errorMsg: 'The passwords you entered do not match' });
      return;
    }

    this.setState({ loading: true });

    //post user details to server
    fetch(
      'https://mangahaven-server.netlify.app/.netlify/functions/app/users/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          passwordTwo,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data._id !== undefined) {
          //sign user in to get token
          this.logUserIn(email, password);

          //replace default avatar with retro
          data.avatar = data.avatar.replace('d=mm', 'd=retro');

          //update user info stored in web storage
          localForage
            .getItem('user')
            .then((value) => {
              if (value !== null) {
                value.signedIn = true;
                value.avatar = `https:${data.avatar}`;
                value.dateJoined = data.date;
                value.email = data.email;
                value.name = data.name;
                value.id = data._id;
              } else {
                value = {
                  signedIn: true,
                  avatar: `https:${data.avatar}`,
                  dateJoined: data.date,
                  email: data.email,
                  name: data.name,
                  id: data._id,
                };
              }
              localForage
                .setItem('user', value)
                .then((value) => {
                  console.log(value);
                  //redirect to user profile
                  this.props.history.push('/profile');
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        } else {
          //display error response from server
          this.setState({ loading: false });
          if (data.name) this.setState({ errorMsg: 'Username already exists' });
          else if (data.email)
            this.setState({ errorMsg: 'Email address already exists' });
          else if (data.passwordTwo)
            this.setState({
              errorMsg: 'The passwords you entered do not match',
            });
        }
      })
      .catch((err) => {
        //display error in case of network down
        this.setState({
          loading: false,
          errorMsg:
            'An error occurred. Please check your internet connection and try again',
        });
      });
  };

  logUserIn = (email, password) => {
    fetch(
      'https://mangahaven-server.netlify.app/.netlify/functions/app/users/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          //store JWT securely in localstorage
          const ls = new SecureLS();
          ls.set('userToken', data.token);

          //create user profile with JWT
          this.createProfile(data.token);
        }
      })
      .catch((err) => console.log(err));
  };

  createProfile = (token) => {
    fetch(
      'https://mangahaven-server.netlify.app/.netlify/functions/app/profile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    )
      .then((res) => res.json())
      .then(console.log)
      .catch(console.log);
  };

  updateEmail = (e) => this.setState({ email: e.target.value, errorMsg: '' });

  updatePassword = (e) => {
    this.setState({ password: e.target.value, errorMsg: '' });
    if (e.target.value === '') this.setState({ controlHidden: true });
    else this.setState({ controlHidden: false });
  };

  updateName = (e) => this.setState({ name: e.target.value, errorMsg: '' });

  updatePasswordTwo = (e) => {
    this.setState({ passwordTwo: e.target.value, errorMsg: '' });
    if (e.target.value === '') this.setState({ controlTwoHidden: true });
    else this.setState({ controlTwoHidden: false });
  };

  render() {
    const { updateEmail, updatePassword, updateName, updatePasswordTwo } = this;
    const { controlHidden, controlTwoHidden } = this.state;
    return (
      <div className='auth-form'>
        <Helmet>
          <title>Sign Up - MangaHaven</title>
          <meta name='theme-color' content='#FDFFFC' />
        </Helmet>
        <AppName />
        <h2>Create your account</h2>
        <p className='error-message'>{this.state.errorMsg}</p>
        <form className='signup-form' onSubmit={this.registerUser}>
          <label htmlFor='username'>
            <p>Username</p>
            <input
              type='text'
              id='username'
              onChange={updateName}
              className='user-name'
              required
            />
          </label>

          <AuthDetails
            value='Sign Up'
            loader={this.state.loading}
            updateEmail={updateEmail}
            updatePassword={updatePassword}
            hideControl={controlHidden}
            updatePasswordTwo={updatePasswordTwo}
            hideControlTwo={controlTwoHidden}
          />

          <p className='auth-redirect'>
            <span>Already have an account?</span>
            <a href='/signin'>Log in now</a>
          </p>
        </form>
      </div>
    );
  }
}

export default withRouter(SignUp);
