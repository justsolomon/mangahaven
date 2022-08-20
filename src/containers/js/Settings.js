import React from 'react';
import MiniHeader from '../../components/js/MiniHeader.js';
import Collapsible from '../../components/js/Collapsible.js';
import CheckButton from '../../components/js/CheckButton.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import localForage from 'localforage';
import { Helmet } from 'react-helmet';
import NavBar from './NavBar.js';
import '../css/Settings.css';

class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      theme: 'light',
      view: 'horizontal',
      readMode: 'normal',
      background: 'light',
    };
  }

  componentDidMount() {
    //check if preferences have alread been set
    localForage
      .getItem('userPreferences')
      .then((value) => {
        if (value !== null) {
          this.setState({
            view: value.readView,
            readMode: value.readMode,
            background: value.readBG,
          });
        }
        console.log(value);
      })
      .catch((err) => console.log(err));
  }

  toggleWebtoon = () => {
    this.updatePref('readMode', 'webtoon');
    this.setState({ readMode: 'webtoon' });
  };

  toggleNormal = () => {
    this.updatePref('readMode', 'normal');
    this.setState({ readMode: 'normal' });
  };

  toggleHorizontal = () => {
    this.updatePref('readView', 'horizontal');
    this.setState({ view: 'horizontal' });
  };

  toggleVertical = () => {
    this.updatePref('readView', 'vertical');
    this.setState({ view: 'vertical' });
  };

  toggleLightBG = () => {
    this.updatePref('readBG', 'light');
    this.setState({ background: 'light' });
  };

  toggleDarkBG = () => {
    this.updatePref('readBG', 'dark');
    this.setState({ background: 'dark' });
  };

  updatePref = (key, value) => {
    localForage
      .getItem('userPreferences')
      .then((prefs) => {
        if (prefs !== null) {
          prefs[key] = value;
          localForage
            .setItem('userPreferences', prefs)
            .then((val) => console.log(val))
            .catch((err) => console.log(err));
        } else {
          prefs = {
            theme: 'light',
            readView: 'horizontal',
            readMode: 'normal',
            readBG: 'light',
          };
          prefs[key] = value;
          localForage
            .setItem('userPreferences', prefs)
            .then((val) => console.log(val))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { theme, view, readMode, background } = this.state;
    return (
      <div className='settings-page'>
        <Helmet>
          <title>Settings - MangaHaven</title>
          <meta name='theme-color' content='#4664c8' />
        </Helmet>
        <MiniHeader currentMenu='Settings' />
        <NavBar page='settings' />
        <div className='setting-headers'>
          <Collapsible
            trigger='General'
            triggerTagName='div'
            transitionTime={250}
          >
            <div className='setting-options'>
              <p className='setting-name'>Theme:</p>
              <div className='check-box light-theme'>
                <CheckButton classname='light' view={theme} />
                <p>Light</p>
              </div>
              <div className='check-box dark-theme'>
                <CheckButton classname='dark' view={theme} />
                <p>Dark(coming soon)</p>
              </div>
            </div>
          </Collapsible>

          <Collapsible
            trigger='Reader'
            triggerTagName='div'
            transitionTime={250}
          >
            <div className='setting-options'>
              <p className='setting-name'>View:</p>
              <div className='check-box' onClick={this.toggleHorizontal}>
                <CheckButton classname='horizontal' view={view} />
                <p>Horizontal</p>
              </div>
              <div className='check-box' onClick={this.toggleVertical}>
                <CheckButton classname='vertical' view={view} />
                <p>Vertical</p>
              </div>
            </div>

            <div className='setting-options'>
              <p className='setting-name'>Mode:</p>
              <div className='check-box' onClick={this.toggleNormal}>
                <CheckButton classname='normal' view={readMode} />
                <p>Normal</p>
              </div>
              <div className='check-box' onClick={this.toggleWebtoon}>
                <CheckButton classname='webtoon' view={readMode} />
                <p>Webtoon</p>
              </div>
            </div>

            <div className='setting-options'>
              <p className='setting-name'>Background:</p>
              <div className='check-box' onClick={this.toggleLightBG}>
                <CheckButton classname='light' view={background} />
                <p>Light</p>
              </div>
              <div className='check-box' onClick={this.toggleDarkBG}>
                <CheckButton classname='dark' view={background} />
                <p>Dark</p>
              </div>
            </div>
          </Collapsible>

          <Collapsible
            trigger='Credits'
            triggerTagName='div'
            transitionTime={250}
          >
            <div className='attribution'>
              <a
                href='https://www.designevo.com/logo-maker/'
                title='Free Online Logo Maker'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span>Logo made by DesignEvo free logo creator</span>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
            </div>
          </Collapsible>

          <Collapsible
            trigger='About'
            triggerTagName='div'
            transitionTime={250}
          >
            <div className='about-section'>
              <a
                href='https://github.com/justsolomon/mangahaven'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span>GitHub</span>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
            </div>
          </Collapsible>

          <Collapsible
            trigger='Feedback & Bug Reports'
            triggerTagName='div'
            transitionTime={250}
          >
            <div className='feedback-reports'>
              <a
                href='mailto:gbolahanbalogun5@gmail.com?subject=Bug Reports & Feedback'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span>Send an Email</span>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
              <a
                href='https://github.com/justsolomon/mangahaven/issues/new'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span>Add a new issue on GitHub</span>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
            </div>
          </Collapsible>
        </div>
      </div>
    );
  }
}

export default Settings;
