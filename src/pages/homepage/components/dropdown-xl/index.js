import React from 'react';
import { Adopt } from 'react-adopt';
import idGenerator from 'react-id-generator';

import Image from '../../../../shared-components/image';
import Loader from '../../../../shared-components/loader';
import { searchQuery } from '../../../../operations/queries';
import './index.css';

const mapper = { searchQuery };

export default ({ keywords }) => (
  <Adopt mapper={mapper} keywords={keywords}>
    {({
      searchQuery
    }) => {
      const { data: { videos: videosResp }, loading } = searchQuery;
      const videos = videosResp || [];
      if (loading) { return <Loader classContainer="dropdownXlLoader" />; }

      return (
        <div className="dropdownXlContainer">
          <div className="dropdownXl">
            {
              videos.slice(0, 9).map(({
                id, image, placeholder,
              }) => (
                <div className="item" key={idGenerator()}>
                  <a href={`/video/${id.slice(-5)}`}>
                    <Image src={image} placeholder={placeholder} className="itemContainer" />
                  </a>
                </div>
              ))
            }
          </div>
          {!videos.length && (
              <div className="empty">
                <p>NO RESULTS</p>
              </div>
            )}
        </div>
      );
    }}
  </Adopt>
);
