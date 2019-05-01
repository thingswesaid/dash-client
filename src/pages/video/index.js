/* eslint-disable no-undef */
import React, { Fragment } from 'react';
import { Adopt } from 'react-adopt';

import { sort } from '../../utils';
import MainVideo from './components/main-video';
import Promo from './components/promo-video';
import SuggestedVideos from './components/suggested-videos';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import VideoNotFound from './components/video-not-found';
import Educational from './components/educational';
import Merch from './components/merch';
import './index.css';

import {
  getVideoQuery,
  latestVideosQuery,
  promoVideosQuery,
  productsQuery,
} from '../../operations/queries';
import {
  addUserIpMutation,
  createAnonymousIpMutation,
  addUserToVideoMutation,
} from '../../operations/mutations';

const mapper = {
  getVideoQuery,
  latestVideosQuery,
  promoVideosQuery,
  productsQuery,
  addUserIpMutation,
  createAnonymousIpMutation,
  addUserToVideoMutation,
};

// CONSOLIDATE ALL QUERIES INTO ONE ENDPOINT (video + latest + promo + products)
// >>> buy video - then click to preview - then back to extended doesn't work
// check user status and ip blocked before showing the page
// transfer assets to wasabi and setup cloudflare
// build other pages listed in router component
// >>>> hide merch temp

// MEMBERS early release (watch on youtube so people can like and comment)
// Create and Mantain Facebook, IG + influencers to drive visits to videos in first 24 hours

export default (props) => {
  const { videoId, userIp } = props;
  return (
    <Fragment>
      <Adopt mapper={mapper} id={videoId} ip={userIp}>
        {({
          getVideoQuery: getVideo,
          latestVideosQuery: latestVideos,
          promoVideosQuery: promoVideos,
          productsQuery: products,
          addUserIpMutation: addUserIp,
          createAnonymousIpMutation: createAnonymousIp,
          addUserToVideoMutation: addUserToVideo,
        }) => {
          const {
            data: videoResp, loading, error, refetch,
          } = getVideo;

          if (
            videoResp.videos
            && (!videoResp.videos.length || !videoResp.videos[0].published)
          ) { return (<VideoNotFound />); }
          // TODO create query param to add to the url to see videos that are not published ?showNotPublished=true
          if (loading) { return <Loader />; }
          if (error) { return <Error error={error} />; } /* TODO log to sumo or similar */

          const video = videoResp.videos[0];
          const { data: { latestVideos: suggestedVideos } } = latestVideos;
          const { data: { promoVideos: promoVideosArray } } = promoVideos;
          const { data: { products: productsArray } } = products;
          const promoVideo = promoVideosArray ? promoVideosArray[Math.floor(Math.random() * promoVideosArray.length)] : {};
          const productTypes = productsArray ? sort([...new Set(productsArray.map(product => product.type))]) : [];

          const showMerch = false;

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
              {showMerch ? (
                <div className="bottomPage">
                  <Educational />
                  <Merch products={productsArray || []} types={productTypes} />
                </div>
              ) : ''
              }
            </Fragment>
          );
        }}
      </Adopt>
    </Fragment>
  );
};
