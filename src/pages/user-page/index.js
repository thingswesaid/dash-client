import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import StackGrid from 'react-stack-grid';
import idGenerator from 'react-id-generator';
import sizeMe from 'react-sizeme';
import _ from 'lodash';

import { USER_QUERY } from '../../operations/queries';
import { getCookie, removeCookie } from '../../cookieUtils';
import { COOKIE_USER_ID, COOKIE_USER_TOKEN } from '../../constants';
import Loader from '../../shared-components/loader';
import Video from './components/video';
import PromoCode from './components/promo-code';
import Quote from './components/quote';

import './index.css';

const userPage = ({ size: { width } }) => {
  const userId = getCookie(COOKIE_USER_ID);
  return (
    <Query query={USER_QUERY} variables={{ id: userId }}>
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error.message}`; // TODO CHANGE USE ERROR COMPONENT
        if (data.userPage && !data.userPage.user) {
          removeCookie(COOKIE_USER_TOKEN); 
          removeCookie(COOKIE_USER_ID);  
          window.location.assign(`/?notification=Please%20login`);
          return <Loader />;
        } 

        const { userPage: { user: { email, orders, promoCodes }, quotes } } = data;
        const validOrders = _.reject(orders, (order) => !order.video);
        const ordersAndCodes = _.sortBy([ ...validOrders, ...promoCodes ], 'createdAt');
  
        const allData = _.flatMap(ordersAndCodes, (value, index) => {
          const quoteIndex = index / 3;
          return index % 3 === 0
            ? [value, quotes[quoteIndex]]
            : value
          });

        return (
          <div className="userPage">
            <p className="title">Activity Feed</p>
            <p className="description">All of your videos and promos in one place.</p>
            {allData.length 
              ? <StackGrid
                  columnWidth={width <= 565 ? 150 : 250}
                  gutterWidth={10}
                  gutterHeight={10}
                >
                  {allData.reverse().map((obj) => <Fragment key={idGenerator()}> 
                      {obj.code && <PromoCode promoCode={obj} />}
                      {obj.video && <Video video={obj.video} />}
                      {obj.text && <Quote quote={obj} /> }
                    </Fragment>
                  )}
                </StackGrid>
              : <div>NO ACTIVITY YET</div> 
              }
            <div className="dock">
              <button className="logout" onClick={() => {  
                removeCookie(COOKIE_USER_TOKEN); 
                removeCookie(COOKIE_USER_ID);  
                window.location.assign('/');
              }}>LOGOUT</button>
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default sizeMe()(userPage);