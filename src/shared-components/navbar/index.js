import React, { Component } from 'react';
import classNames from 'classnames';

import './index.css';
import DashLogo from '../../assets/images/dash-logo.png';
import Search from '../search';
import { getWindowHeight } from '../../utils';

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

  closeSearch = () => {
    this.setState({ searchOpen: false });
  }

  render() {
    const { searchOpen } = this.state;
    const { shrink } = this.state;
    const shouldShrink = shrink && !searchOpen;

    return (
      <div className={classNames('navbarContainer', { searchOpen, shrink: shouldShrink })}>
        <div className="navBar">
          <img src={DashLogo} alt="dash in between logo" />
          {searchOpen ? <Search close={this.closeSearch} /> : '' }
          {searchOpen ? (
            <i
              className="fas fa-times-circle"
              onClick={() => {
                const body = document.querySelector('body');
                body.style.overflow = "initial";
                this.setState({ searchOpen: !searchOpen })
              }}
              onKeyPress={() => {
                const body = document.querySelector('body');
                body.style.overflow = "initial";
                this.setState({ searchOpen: !searchOpen })
              }}
              role="button"
              tabIndex={0}
            />
          ) : (
            <i
              className="fas fa-search"
              onClick={() => {
                const body = document.querySelector('body');
                body.style.overflow = "hidden";
                this.setState({ searchOpen: !searchOpen })
              }}
              onKeyPress={() => {
                const body = document.querySelector('body');
                body.style.overflow = "hidden";
                this.setState({ searchOpen: !searchOpen })
              }}
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