import React from 'react';
import idGenerator from 'react-id-generator';
import Image from '../../../../shared-components/image';

import { shuffle } from '../../../../utils';
import './index.css';

export default ({ videos }) => {
  const allVideos = shuffle(videos) || [];
  return (
    <div className="suggestion">
      <p className="title">MORE FOR YOU</p>
      <div className="videosList">
        {allVideos.map(({
          image, placeholder, title, id, published,
        }) => (published ? (
          <a href={`/video/${id.slice(-5)}`} key={idGenerator()}>
            <div className="video">
              <div className="suggestedImageContainer">
                <Image image={image} placeholder={placeholder} className="image" />
              </div>
              <p>{title}</p>
            </div>
          </a>
        ) : ''))}
      </div>
    </div>
  );
};
// check published <<<
