import React from 'react';
import { Query } from 'react-apollo';
import idGenerator from 'react-id-generator';

import { SCHEDULED_VIDEOS_QUERY } from '../../../../operations/queries';
import Loader from '../../../../shared-components/loader';
import Error from '../../../../shared-components/error';
import Image from '../../../../shared-components/image';

import './index.css'; 

export default ({ from, to }) => (
  <Query query={SCHEDULED_VIDEOS_QUERY}>
    {({ loading, error, data }) => {
      if (loading) { return <div style={{ height: '400px' }}><Loader /></div>; }
      else if (error) { return <Error message="We will be right back!" />; }

      const videoDates = JSON.parse(data.scheduledVideos);

      return (
        <div className="videoAnalytics">
          <p className="title">SCHEDULED VIDEOS</p>
          <i className="fas fa-arrow-down" />
          {!videoDates.length && <div className="noVideos">NO UPCOMING VIDEOS</div>}
          <div className="videos">
            {videoDates.map((videoDate) => (
              <div key={idGenerator()} className="videoGroup">
                <p>{videoDate[0].slice(0, 19)}</p>
                <div className="list">
                  {videoDate[1].map(({ id, image, placeholder, title }) => (
                    <a key={idGenerator()} href={`/video/${id.slice(-5)}?showall=true`} target="_blank">
                      <Image src={image} placeholder={placeholder} className="itemContainer" />
                      <p>{title}</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }}
  </Query>
)