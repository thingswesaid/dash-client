/* eslint-disable no-undef */
import React, { Fragment } from 'react';
import { Adopt } from 'react-adopt';

import { getVideoQuery, latestVideosQuery, promoVideosQuery } from '../../operations/queries';
import { addUserIpMutation, createAnonymousIpMutation, addUserToVideoMutation } from '../../operations/mutations';
import MainVideo from './components/main-video';
import Promo from './components/promo-video';
import SuggestedVideos from './components/suggested-videos';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import VideoNotFound from './components/video-not-found';
import './index.css';

const mapper = {
  getVideoQuery,
  latestVideosQuery,
  promoVideosQuery,
  addUserIpMutation,
  createAnonymousIpMutation,
  addUserToVideoMutation,
};

// >>> buy video - then click to preview - then back to extended doesn't work
// suggested video should not show current video (pass ID)
// autoplay video on mobile
// util.js published video select <<<
// build Mobile view (copy youtube app layout - video fixed - label - suggested)
// check user status and ip blocked before showing the page
// look into teespring for api / display product (or just store image and link in DB)
// find where to store images - cdn
// build other pages listed in router component

// MEMBERS early release (watch on youtube so people can like and comment)
// Create and Mantain Facebook, IG to drive visits to videos in first 24 hours

export default (props) => {
  const { videoId, userIp } = props;
  return (
    <Fragment>
      <Adopt mapper={mapper} id={videoId} ip={userIp}>
        {({
          getVideoQuery: getVideo,
          latestVideosQuery: latestVideos,
          promoVideosQuery: promoVideos,
          addUserIpMutation: addUserIp,
          createAnonymousIpMutation: createAnonymousIp,
          addUserToVideoMutation: addUserToVideo,
        }) => {
          const {
            data: videoResp, loading, error, refetch,
          } = getVideo;
          const { data: { latestVideos: suggestedVideos } } = latestVideos;
          const { data: { promoVideos: promoVideosArray } } = promoVideos;

          const promoVideo = promoVideosArray ? promoVideosArray[Math.floor(Math.random() * promoVideosArray.length)] : {};

          if (loading) { return <Loader />; }
          if (error) { return <Error error={error} />; } /* TODO log to sumo or similar */
          // TODO create query param to add to the url to see videos that are not published ?showNotPublished=true
          if (!videoResp.videos.length || !videoResp.videos[0].published) { return <VideoNotFound />; }

          const video = videoResp.videos[0];

          return (
            <Fragment>
              <div className="page">
                <div className="videoWrapper">
                  <MainVideo
                    video={video}
                    userIp={userIp}
                    addUserIp={addUserIp}
                    refetchVideo={refetch}
                    addUserToVideo={addUserToVideo}
                    createAnonymousIp={createAnonymousIp}
                  />
                  <div className="separator" />
                  <Promo video={promoVideo} orientation="portrait" />
                </div>
                <div className="mobileWrapper" />
                <SuggestedVideos videos={suggestedVideos} />
                <Promo video={promoVideo} orientation="landscape" />
              </div>
              <div className="merch" />
            </Fragment>
          );
        }}
      </Adopt>
    </Fragment>
  );
};
