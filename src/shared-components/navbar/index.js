import React, { Component } from 'react';
import classNames from 'classnames';
import Media from 'react-media';

import Auth from './components/auth';
import { COOKIE_USER_TOKEN, COOKIE_RECENT_ORDER } from '../../constants';
import { getCookie, addChangeListener, removeChangeListener } from '../../cookieUtils';
import { getUrlParams } from '../../utils';
import DashLogo from '../../assets/images/dash-logo.png';
import Dropdown from '../dropdown';
import './index.css';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
			searchInput: '',
      urlToken: '',
      dropdownClosed: true,
      sideNavOpen: false,
      authOpen: false,
      afterCheckout: false,
      recover: false,
    };
  }

  componentDidMount() {
    const { reset, token } = getUrlParams();
    if (reset && token) { this.setState({ authOpen: true, reset: true, urlToken: token }) }
    addChangeListener(this.cookieCheck);
  }

  cookieCheck = ({ name }) => {
    const userLoggedIn = getCookie(COOKIE_USER_TOKEN);
    if (name === COOKIE_RECENT_ORDER && !userLoggedIn) {
      this.setState({ authOpen: true, afterCheckout: true });
      removeChangeListener(this.cookieCheck);
    }
  }

	closeDropdown = () => {
		this.setState({ dropdownClosed: true })
	}

  render() {
    const { searchInput, dropdownClosed, sideNavOpen, authOpen, afterCheckout, reset, urlToken } = this.state;
    const userLoggedIn = getCookie(COOKIE_USER_TOKEN);

    return (
      <div className={classNames('navbarContainer')}>
        <div className="navBar">
          <div className="left">
            <a href='/'>
              <img src={DashLogo} className="logo" alt="Dash in Between Tarot Zodiac" />
            </a>
						<input 
							placeholder="Search" 
							onChange={(e) => { this.setState({ searchInput: e.target.value.toLowerCase(), dropdownClosed: false }) }}
							onFocus={() => { this.setState({ dropdownClosed: false }) }}
						/>
            {searchInput.length && !dropdownClosed ? <Dropdown keywords={searchInput} closeDropdown={this.closeDropdown} /> : '' }
						<i className="fas fa-search" />    
          </div>
          <Media query="(min-width: 550px)">
            <div className="right">
              {/* <a href="/pick-a-card">Pick-a-Card</a> */}
              {!userLoggedIn && <a onClick={() => { this.setState({ authOpen: true }) }}>Login</a>} {/* change a to button also in CSS */}
              {userLoggedIn && <a href="/user"><i className="far fa-user" /></a>}
            </div>
          </Media>
          <Media query="(max-width: 549px)">
            <div 
              className="right" 
              onClick={() => { this.setState({ sideNavOpen: !sideNavOpen }) }}
            >
              <i className="fas fa-bars" />
            </div>
          </Media>
          <div 
            className={classNames('sideNavContainer', { zoomInRight: sideNavOpen })}
            onClick={() => { this.setState({sideNavOpen: false}) }}
          />
          <div className={classNames('sideNav', { show: sideNavOpen })}>
            <h1>DASH</h1>
            <div>
              {!userLoggedIn && <a onClick={() => { this.setState({ authOpen: true, sideNavOpen: false }) }}>LOG IN</a>}
              {userLoggedIn && <a href="/user">PROFILE</a>}
              {/* <a href="/pick-a-card">PICK A CARD</a> */}
            </div>
            <div className="separator" />
            <div className="socials">
              <a href="https://www.instagram.com/dash.inbetween/?hl=en" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.youtube.com/channel/UCXijIQQdb6XX8zhPJWAxPHQ/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"/>
              </a>
            </div>
          </div>
          <Auth 
            show={authOpen} 
            resetPsw={reset}
            urlToken={urlToken}
            afterCheckout={afterCheckout} 
            removeAfterCheckout={() => { this.setState({ afterCheckout: false }) }}
            close={() => { this.setState({ authOpen: false, reset: false }) }}/>
        </div>
      </div>
    );
  }
}