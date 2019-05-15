/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { Adopt } from 'react-adopt';
import idGenerator from 'react-id-generator';

import { searchQuery } from '../../operations/queries';
import Image from '../image';
import './index.css';

const mapper = {
  searchQuery,
};

export default ({ close }) => (
  <Adopt mapper={mapper} variables={{ skip: false }}>
    {({
      searchQuery: searchData,
    }) => {
      const { refetch: fetchVideos, data: { videos: videosResp } } = searchData;
      const videos = videosResp || [];

      return (
        <div className="search">
          <input
            autoFocus
            className="search"
            placeholder="zodiac sign"
            onKeyUp={(e) => {
              fetchVideos({ keywords: e.target.value.toLowerCase(), skip: false });
            }}
          />
          <div className="dropdown">
            {
        videos.map(({
          id, image, placeholder, title,
        }) => (
          <div className="item" key={idGenerator()}>
            <a href={`/video/${id.slice(-5)}`}>
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
    }}
  </Adopt>
);
