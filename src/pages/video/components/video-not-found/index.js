import React from 'react';
import idGenerator from 'react-id-generator';
import { Query } from 'react-apollo';
import Image from '../../../../shared-components/image';


import Loader from '../../../../shared-components/loader';
import Error from '../../../../shared-components/error';
import './index.css';

import { LATEST_VIDEOS_QUERY } from '../../../../operations/queries';

// show mosaic with all other videos - VIDEO NOT FOUND in the middle - can click on other videos
export default () => (
  <Query query={LATEST_VIDEOS_QUERY} variables={{ quantity: 15 }}>
    {({ loading, error, data }) => {
      if (loading) { return <Loader />; }
      if (error) { return <Error error={error} />; } /* TODO log to sumo or similar */
      const { latestVideos: videos } = data;

      return (
        <div className="notFound">
          <p className="main">VIDEO NOT FOUND</p>
          <p>more for you</p>
          <div className="container">
            {videos.map(({ image, placeholder, link }) => (
              <a href={link} key={idGenerator()}>
                <Image image={image} placeholder={placeholder} className="image" />
              </a>
            ))}
          </div>
        </div>
      );
    }}
  </Query>
);
