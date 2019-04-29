/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component, Fragment } from 'react';
import idGenerator from 'react-id-generator';
import classNames from 'classnames';

import Image from '../../../../shared-components/image';
import './index.css';

export default class Merch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeSelected: 'Accessories', // should be in componentWillReceiveProps but not always working
      showDropdown: false,
    };
  }

  selectType(type) {
    this.setState({ typeSelected: type });
  }

  toggleDropdown() {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
  }

  renderNav(isMobile = false) {
    const { types } = this.props;
    return types.map((type => (
      <div
        className={isMobile ? 'typeMobile' : 'type'}
        key={idGenerator()}
        onClick={() => { this.selectType(type); this.setState({ showDropdown: false }); }}
        onKeyDown={() => { this.selectType(type); this.setState({ showDropdown: false }); }}
        role="button"
        tabIndex="0"
      >
        {isMobile ? type.toUpperCase() : type}
      </div>
    )));
  }

  renderProducts() {
    const { products } = this.props;
    const { typeSelected } = this.state;
    const showProducts = products.filter(product => product.type === typeSelected);
    return (
      <Fragment>
        {showProducts.map(({ link, image, placeholder }) => (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="product"
            key={idGenerator()}
          >
            <Image image={image} placeholder={placeholder} className="productImage" />
          </a>
        ))}
      </Fragment>
    );
  }


  render() {
    const { typeSelected, showDropdown } = this.state;

    return (
      <div className="merch">
        <div className="navMerch">
          {this.renderNav()}
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
                  {this.renderNav(true)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="products">{this.renderProducts()}</div>
      </div>
    );
  }
}
