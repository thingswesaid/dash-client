import React, { Component } from 'react';
import classNames from 'classnames';

import './index.css';
import DashLogo from '../../assets/images/dash-logo.png';
import Search from '../search';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchOpen: false,
    };
  }

  closeSearch = () => {
    this.setState({ searchOpen: false });
  }

  render() {
    const { searchOpen } = this.state;

    return (
      <div className={classNames('navbarContainer', { searchOpen })}>
        <div className="navBar">
          <img src={DashLogo} alt="dash in between logo" />
          {searchOpen ? <Search close={this.closeSearch} /> : '' }
          {searchOpen ? (
            <i
              className="fas fa-times-circle"
              onClick={() => this.setState({ searchOpen: !searchOpen })}
              onKeyDown={() => this.setState({ searchOpen: !searchOpen })}
              role="button"
              tabIndex={0}
            />
          ) : (
            <i
              className="fas fa-search"
              onClick={() => this.setState({ searchOpen: !searchOpen })}
              onKeyDown={() => this.setState({ searchOpen: !searchOpen })}
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
