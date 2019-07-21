import React, { Fragment } from 'react';
import { Adopt } from 'react-adopt';

import MainVideo from './components/main-video';
// TODO rename Promo to PromoVideo
import Promo from './components/promo-video';
import PromoModal from './components/promo-modal';
import SuggestedVideos from './components/suggested-videos';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import Educational from './components/educational';
import { getCookie } from '../../cookieUtils';
// import Merch from './components/merch';
import './index.css';

import { videoPageQuery } from '../../operations/queries';
import { addUserIpMutation, createOrderMutation } from '../../operations/mutations';

// productsQuery,
const mapper = {
  videoPageQuery,
  addUserIpMutation,
  createOrderMutation,
};

export default (props) => {
  const { videoId, userId, userIp, location, showAll } = props;
  
  return (
    <Fragment>
      <Adopt mapper={mapper} id={videoId} ip={userIp} userId={userId} showAll={showAll}>
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
                video, latestVideos, promoVideo, user, sitePromo,
              },
            } = data;

            // const { data: { products: { items: products, types: productTypes } } } = productsData;
            const showMerch = false;
            const promoCookie = sitePromo ? getCookie(sitePromo.promoOffer) : '';
            const showPromo = sitePromo && !promoCookie && sitePromo.type === video.type;
            const userActive = user ? user.active : true;

            const blockedIps = ["173.245.46.210", "68.231.201.15", "174.211.12.179", "174.211.15.219", "174.213.14.177", "92.25.156.43"];

            return userActive && !blockedIps.includes(userIp) ? (
              <Fragment>
                <div className="seo">
                  <h1>{video.keywords}</h1>
                  <h2>Checkout this tarot reading to find out what your monthly energies are going to be.</h2>
                </div>
                <div className="page">
                  {showPromo && <PromoModal promo={sitePromo} />}
                  <div className="videoWrapper">
                    <MainVideo
                      video={video}
                      userIp={userIp}
                      location={location}
                      addUserIp={addUserIp}
                      createOrder={createOrder}
                      sitePromo={sitePromo}
                      user={user} // to debug non-capture payments
                    />
                    {promoVideo && <div className="separator" />}
                    {promoVideo && <Promo video={promoVideo} orientation="portrait" />}
                  </div>
                  <div className="mobileWrapper" />
                  {latestVideos && <SuggestedVideos videos={latestVideos} />}
                  {promoVideo && <Promo video={promoVideo} orientation="landscape" />}
                </div>
                {showMerch && (
                  <div className="bottomPage">
                    <Educational />
                    {/* <Merch products={products || []} types={productTypes} /> */}
                  </div>
                )}
              </Fragment>
            ) : (
              <Error message="Account not active. If you think this is a mistake contact us right away." />
            );
          } catch (error) {
            return (<Error message="Video not found." />);
          }
        }}
      </Adopt>
    </Fragment>
  );
};
