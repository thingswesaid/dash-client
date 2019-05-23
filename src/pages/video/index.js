import React, { Fragment } from 'react';
import { Adopt } from 'react-adopt';

import MainVideo from './components/main-video';
import Promo from './components/promo-video';
import SuggestedVideos from './components/suggested-videos';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import Educational from './components/educational';
// import Merch from './components/merch';
import './index.css';

import { videoPageQuery } from '../../operations/queries';
import {
  addUserIpMutation,
  createOrderMutation,
} from '../../operations/mutations';

const mapper = {
  videoPageQuery,
  // productsQuery,
  addUserIpMutation,
  createOrderMutation,
};

export default (props) => {
  const {
    videoId, userIp, cookieEmail, showAll,
  } = props;

  return (
    <Fragment>
      <Adopt mapper={mapper} id={videoId} ip={userIp} email={cookieEmail} showAll={showAll}>
        {({
          videoPageQuery: videoPageData,
          addUserIpMutation: addUserIp,
          createOrderMutation: createOrder,
        }) => {
          try {
            const { data, loading, error } = videoPageData;

            if (loading) { return <Loader />; }
            if (error) { return <Error message="We will be right back!" />; }
            const {
              videoPage: {
                video, latestVideos, promoVideo, userActive,
              },
            } = data;

            // const { data: { products: { items: products, types: productTypes } } } = productsData;
            const showMerch = false;

            return userActive ? (
              <Fragment>
                <div className="page">
                  <div className="videoWrapper">
                    <MainVideo
                      video={video}
                      userIp={userIp}
                      addUserIp={addUserIp}
                      createOrder={createOrder}
                    />
                    {promoVideo ? <div className="separator" /> : ''}
                    {promoVideo ? <Promo video={promoVideo} orientation="portrait" /> : ''}
                  </div>
                  <div className="mobileWrapper" />
                  {latestVideos ? <SuggestedVideos videos={latestVideos} /> : ''}
                  {promoVideo ? <Promo video={promoVideo} orientation="landscape" /> : ''}
                </div>
                {showMerch ? (
                  <div className="bottomPage">
                    <Educational />
                    {/* <Merch products={products || []} types={productTypes} /> */}
                  </div>
                ) : ''}
              </Fragment>
            ) : (
              <Error message="Account not active. If you think this is a mistake contact us right away." />
            );
          } catch (e) {
            return (<Error message="Video not found." />);
          }
        }}
      </Adopt>
    </Fragment>
  );
};
