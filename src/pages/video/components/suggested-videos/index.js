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
          image, placeholder, title, id,
        }) => (
          <a href={`/video/${id.slice(-5)}`} key={idGenerator()}>
            <div className="video">
              <div className="suggestedImageContainer">
                <Image src={image} placeholder={placeholder} />
              </div>
              <p>{title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
