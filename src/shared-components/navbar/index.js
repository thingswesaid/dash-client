import React, { Component } from 'react';
import classNames from 'classnames';

import DashLogo from '../../assets/images/dash-logo.png';
import Search from '../search';
import { getWindowHeight } from '../../utils';
import './index.css';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchOpen: false,
      shrink: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      getWindowHeight(20, this);
    });
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', () => {
      getWindowHeight(20, this);
    });
  }

  toggleSearch = (bool) => {
    const body = document.querySelector('body');
    body.style.overflow = bool ? 'hidden' : 'initial';
    this.setState({ searchOpen: bool });
  }

  render() {
    const { searchOpen, shrink } = this.state;
    const shouldShrink = shrink && !searchOpen;

    return (
      <div className={classNames('navbarContainer', { searchOpen, shrink: shouldShrink })}>
        <div className="navBar">
        <a href='/'>
          <img src={DashLogo} alt="Dash in Between Tarot Zodiac" />
        </a>
          {searchOpen ? <Search close={this.toggleSearch} searchOpen={searchOpen} /> : '' }
          {searchOpen ? (
            <i
              className="fas fa-times-circle"
              onClick={() => { this.toggleSearch(false) }}
              onKeyPress={() => { this.toggleSearch(false) }}
              role="button"
              tabIndex={0}
            />
          ) : (
            <i
              className="fas fa-search"
              onClick={() => { this.toggleSearch(true) }}
              onKeyPress={() => { this.toggleSearch(true) }}
              role="button"
              tabIndex={0}
            />
          )
        }
        </div>
      </div>
    );
  }
}