import React, { Component } from 'react';
import classNames from 'classnames';

import './index.css';
import DashLogo from '../../assets/images/dash-logo.png';
import Search from '../search';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarOpen: false,
    };
  }

  render() {
    const { navbarOpen } = this.state;

    return (
      <div className={classNames('navbarContainer', { navbarOpen })}>
        <div className="navBar">
          <img src={DashLogo} alt="dash in between logo" />
          {navbarOpen ? <Search /> : '' }
          {navbarOpen ? (
            <i
              className="fas fa-times-circle"
              onClick={() => this.setState({ navbarOpen: !navbarOpen })}
              onKeyDown={() => this.setState({ navbarOpen: !navbarOpen })}
              role="button"
              tabIndex={0}
            />
          ) : (
            <i
              className="fas fa-search"
              onClick={() => this.setState({ navbarOpen: !navbarOpen })}
              onKeyDown={() => this.setState({ navbarOpen: !navbarOpen })}
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
