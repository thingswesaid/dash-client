import React from 'react';
import { Adopt } from 'react-adopt';
import idGenerator from 'react-id-generator';
import StackGrid from 'react-stack-grid';
import sizeMe from 'react-sizeme';

import Image from '../../../../shared-components/image';
import Loader from '../../../../shared-components/loader';
import { searchQuery } from '../../../../operations/queries';
import './index.css';

const mapper = { searchQuery };

const DropdownXl = ({ size: { width }, keywords }) => (
  <Adopt mapper={mapper} keywords={keywords}>
    {({
      searchQuery
    }) => {
      const { data: { videos: videosResp }, loading } = searchQuery;
      const videos = videosResp || [];
      if (loading) { return <Loader classContainer="dropdownXlLoader" />; }

      return (
        <div className="dropdownXlContainer">
          <StackGrid
              columnWidth={200}
              columnWidth={width < 500 ? 150 : 200}
              gutterWidth={10}
              gutterHeight={10}
            >
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
          </StackGrid>
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

export default sizeMe()(DropdownXl);