/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import idGenerator from 'react-id-generator';

import Image from '../image';
import './index.css';

export default ({ close, fetchVideos, videos = [] }) => (
  <div className="search">
    <input
      autoFocus
      className="search"
      placeholder="taurus love april"
      onKeyUp={(e) => { fetchVideos({ keywords: e.target.value.toLowerCase(), skip: false }); }}
    />
    <div className="dropdown">
      {
        videos.map(({
          link, image, placeholder, title,
        }) => (
          <div className="item" key={idGenerator()}>
            <a href={link}>
              <Image src={image} placeholder={placeholder} className="itemContainer shadow" />
              <p>{title}</p>
            </a>
          </div>
        ))
      }
    </div>
    <div
      className="dropdownBackground"
      onClick={() => close(false)}
      onKeyDown={() => close(false)}
      role="presentation"
    />
  </div>
);
