import React from 'react';
import idGenerator from 'react-id-generator';
import { shuffle } from '../../../../utils';
import './index.css';

export default ({ videos }) => {
  const allVideos = shuffle(videos) || [];
  return (
    <div className="suggestion">
      <p className="title">MORE FOR YOU</p>
      <div className="videosList">
        {allVideos.map(({
          image, title, id, published,
        }) => (published ? (
          <a href={`/video/${id.slice(-5)}`} key={idGenerator()}>
            <div className="video">
              <img src={image} alt="suggested video" />
              <p>{title}</p>
            </div>
          </a>
        ) : ''))}
      </div>
    </div>
  );
};
// check published <<<
