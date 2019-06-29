import React, { Component } from 'react';

import Dropdown from './components/dropdown-xl';
import './index.css';

const homepageMGlass = (
  <svg
    className="mGlass"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="22"
    height="21"
    viewBox="0 0 22 21"
  >
    <defs>
      <path
        id="b"
        d="M0 22C0 9.85 9.858 0 21.99 0h1025.02c12.145 0 21.99 9.847 21.99 22 0 12.15-9.858 22-21.99 22H21.99C9.846 44 0 34.153 0 22z"
      />
      <filter
        id="a"
        width="101.9%"
        height="145.5%"
        x="-.9%"
        y="-18.2%"
        filterUnits="objectBoundingBox"
      >
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation="3"
        />
        <feComposite
          in="shadowBlurOuter1"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0.878431373 0 0 0 0 0.88627451 0 0 0 0 0.890196078 0 0 0 1 0"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="#F6F8F8" d="M-235-162h1501V61H-235z" />
      <g transform="translate(-27 -11)">
        <use fill="#000" filter="url(#a)" xlinkHref="#b" />
        <path
          fill="#FFF"
          stroke="#0DBAFC"
          strokeLinejoin="square"
          strokeWidth="2"
          d="M1 22c0 11.6 9.397 21 20.99 21h1025.02c11.584 0 20.99-9.406 20.99-21 0-11.6-9.397-21-20.99-21H21.99C10.407 1 1 10.406 1 22z"
        />
      </g>
      <path
        fill="#7B8C93"
        fillRule="nonzero"
        d="M4.16 15.244a9.799 9.799 0 0 1-1.736-5.561C2.424 4.34 6.714 0 11.994 0c5.278 0 9.569 4.341 9.569 9.683 0 5.341-4.29 9.683-9.57 9.683a9.543 9.543 0 0 1-5.833-2L3.003 20.56A1.42 1.42 0 0 1 1.991 21a1.38 1.38 0 0 1-1.013-.439c-.554-.561-.554-1.488 0-2.073l3.182-3.244zm7.833 2.17c4.219 0 7.641-3.463 7.641-7.731s-3.422-7.732-7.64-7.732c-4.219 0-7.641 3.464-7.641 7.732 0 4.268 3.422 7.732 7.64 7.732z"
      />
    </g>
  </svg>
);

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      dropdownClosed: true,
    };
  }

  // TODO replace search subtitle Ask a question below.
  render() {
    const { searchInput } = this.state;
    return (
      <div className="homepage">
        <div className="searchBar">
          <h1>Make the most of the dash, the Dash in Between.</h1>  
          <h2>Look for your zodiac sign.</h2>  
          <div className="input">
            {homepageMGlass}
            <input 
              placeholder="Search" 
              className="search" 
              onChange={(e) => { this.setState({ searchInput: e.target.value.toLowerCase(), dropdownClosed: false }) }}
              onFocus={() => { this.setState({ dropdownClosed: false }) }}
            />
            <button>SEARCH</button>
          </div>
        </div>
        <Dropdown keywords={searchInput} />
      </div>
    );
  }
}