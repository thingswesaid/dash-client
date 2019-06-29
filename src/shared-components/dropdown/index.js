import React, { Fragment } from 'react';
import { Adopt } from 'react-adopt';
import idGenerator from 'react-id-generator';

import { searchQuery } from '../../operations/queries';
import Image from '../image';
import './index.css';

const mapper = { searchQuery };
let searched = '';

export default ({ keywords, closeDropdown }) => (
  <Adopt mapper={mapper} keywords={keywords}>
    {({
      searchQuery,
    }) => {
      const { refetch: fetchVideos, data: { videos: videosResp } } = searchQuery;
      if (searched !== keywords) {
        fetchVideos({ keywords });
      }
      searched = keywords;
      const videos = videosResp || [];
      return (
        <Fragment>
          <div className="dropdownContainer" onClick={() => { closeDropdown() }} />
          <div className="dropdown">
            {
              videos.map(({ id, image, placeholder, title }) => (
                <div className="item" key={idGenerator()}>
                  <a href={`/video/${id.slice(-5)}`}>
                    <Image src={image} placeholder={placeholder} className="itemContainer shadow" />
                    <p>{title}</p>
                  </a>
                </div>
              ))
            }
          </div>
        </Fragment>
      );
    }}
  </Adopt>
);
