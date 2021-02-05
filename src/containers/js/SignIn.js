import React from 'react';
import AuthDetails from '../../components/js/AuthDetails.js';
import AppName from '../../components/js/AppName.js';
import SecureLS from 'secure-ls';
import localForage from 'localforage';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      email: '',
      password: '',
      errorMsg: '',
      controlHidden: true,
    };
  }

  signUserIn = (e) => {
    const { email, password } = this.state;
    e.preventDefault();
    this.setState({ loading: true });

    //make post request to API to see if user exists
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

          //fetch user profile
          fetch(
            'https://mangahaven-server.netlify.app/.netlify/functions/app/profile',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: data.token,
              },
            }
          )
            .then((res) => res.json())
            .then((profile) => {
              console.log(data);
              //set user details for offline access in storage
              localForage
                .setItem('user', {
                  signedIn: true,
                  avatar: `https:${profile.user.avatar}`,
                  dateJoined: profile.date,
                  email: profile.user.email,
                  name: profile.user.name,
                  id: profile.user._id,
                })
                .then((value) => {
                  //redirect to user profile
                  this.props.history.push('/profile');
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        } else {
          let errorMsg = '';
          if (data.password)
            errorMsg = 'The password you have entered is incorrect';
          else errorMsg = data.email;
          this.setState({
            loading: false,
            errorMsg,
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

  updateEmail = (e) => this.setState({ email: e.target.value, errorMsg: '' });

  updatePassword = (e) => {
    this.setState({ password: e.target.value, errorMsg: '' });
    if (e.target.value === '') this.setState({ controlHidden: true });
    else this.setState({ controlHidden: false });
  };

  render() {
    return (
      <div className='auth-form'>
        <Helmet>
          <title>Login - MangaHaven</title>
          <meta name='theme-color' content='#FDFFFC' />
        </Helmet>
        <AppName />
        <h2>Log in to your account</h2>
        <p className='error-message'>{this.state.errorMsg}</p>
        <form className='signin-form' onSubmit={this.signUserIn}>
          <AuthDetails
            value='Login'
            loader={this.state.loading}
            updateEmail={this.updateEmail}
            updatePassword={this.updatePassword}
            hideControl={this.state.controlHidden}
          />
        </form>
        <p className='auth-redirect'>
          <span>Don't have an account?</span>
          <a href='/signup'>Sign Up</a>
        </p>
      </div>
    );
  }
}

export default withRouter(SignIn);
