/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component, Fragment } from 'react';
import idGenerator from 'react-id-generator';
import classNames from 'classnames';

import './index.css';

export default class Merch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeSelected: '',
      showDropdown: false,
    };
  }

  componentWillReceiveProps() {
    const { types } = this.props;
    this.setState({ typeSelected: types[0] });
  }

  selectType(type) {
    this.setState({ typeSelected: type });
  }

  toggleDropdown() {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
  }

  renderProducts() {
    const { products } = this.props;
    const { typeSelected } = this.state;
    const showProducts = products.filter(product => product.type === typeSelected);
    return (
      <Fragment>
        {showProducts.map(product => (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="product"
            key={idGenerator()}
          >
            <img src={product.image} alt="Dash Product" />
          </a>
        ))}
      </Fragment>
    );
  }

  render() {
    const { types } = this.props;
    const { typeSelected, showDropdown } = this.state;

    return (
      <div className="merch">
        <div className="navMerch">
          {types.map((type => (
            <div
              className="type"
              key={idGenerator()}
              onClick={() => this.selectType(type)}
              onKeyDown={() => this.selectType(type)}
              role="button"
              tabIndex="0"
            >
              {type}
            </div>
          )))}
          <div className="mobileNav">
            <div className="labelContainer">
              <p>{typeSelected}</p>
              <div className="label">
                <p
                  onClick={() => { this.toggleDropdown(); }}
                  onKeyDown={() => { this.toggleDropdown(); }}
                >
Browse
                </p>
                <i className="fas fa-caret-down" />
                <div className={classNames('dropdown', { showDropdown })}>
                  {types.map((type => (
                    <div
                      className="typeMobile"
                      key={idGenerator()}
                      onClick={() => { this.selectType(type); this.setState({ showDropdown: false }); }}
                      onKeyDown={() => { this.selectType(type); this.setState({ showDropdown: false }); }}
                      role="button"
                      tabIndex="0"
                    >
                      {type.toUpperCase()}
                    </div>
                  )))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="products">{this.renderProducts()}</div>
        <div className="line" />
      </div>
    );
  }
}
