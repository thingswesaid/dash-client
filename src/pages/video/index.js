/* eslint-disable no-undef */
import React, { Fragment } from 'react';
import { Adopt } from 'react-adopt';

import { getVideoQuery } from '../../operations/queries';
import { addUserIpMutation, createAnonymousIpMutation, addUserToVideoMutation } from '../../operations/mutations';
import MainVideo from './components/main-video';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import VideoNotFound from './components/video-not-found';
import './index.css';

const mapper = {
  getVideoQuery,
  addUserIpMutation,
  createAnonymousIpMutation,
  addUserToVideoMutation,
};

// build video suggestion section on the left
// build Mobile view (copy youtube app layout - video fixed - label - suggested)
// check user status and ip blocked before showing the page
// look into teespring for api / display product (or just store image and link in DB)
// implement lazyloading for images
// find where to store images - cdn
// build other pages listed in router component

// MEMBERS early release (watch on youtube so people can like and comment)

export default (props) => {
  const { videoId, userIp } = props;
  return (
    <Fragment>
      <Adopt mapper={mapper} id={videoId} ip={userIp}>
        {({
          getVideoQuery: getVideo,
          addUserIpMutation: addUserIp,
          createAnonymousIpMutation: createAnonymousIp,
          addUserToVideoMutation: addUserToVideo,
        }) => {
          const {
            data, loading, error, refetch,
          } = getVideo;
          if (loading) { return <Loader />; }
          if (error) { return <Error error={error} />; } /* log to sumo or similar */
          if (!data.videos.length || !data.videos[0].published) { return <VideoNotFound />; }

          const video = data.videos[0];
          return (
            <Fragment>
              <div className="page">
                <div className="suggestion" />
                <MainVideo
                  video={video}
                  userIp={userIp}
                  addUserIp={addUserIp}
                  refetchVideo={refetch}
                  addUserToVideo={addUserToVideo}
                  createAnonymousIp={createAnonymousIp}
                />
                <div className="ads" />
              </div>
              <div className="merch" />
            </Fragment>
          );
        }}
      </Adopt>
    </Fragment>
  );
};
