import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import StackGrid from 'react-stack-grid';
import idGenerator from 'react-id-generator';
import _ from 'lodash';

import { USER_QUERY } from '../../operations/queries';
import { getCookie } from '../../cookieUtils';
import { COOKIE_USER_ID } from '../../constants';
import Loader from '../../shared-components/loader';
import Video from './components/video';

import './index.css';

export default () => {
  const userId = getCookie(COOKIE_USER_ID);
  return (
    <Query query={USER_QUERY} variables={{ id: userId }}>
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error.message}`; // TODO CHANGE USE ERROR COMPONENT

        const { userPage: { email, orders, promos } } = data;
        const validOrders = _.reject(orders, (order) => !order.video);
        const allData = _.sortBy([ ...validOrders, ...promos ], 'createdAt');

        return (
          <div className="userPage">
            <StackGrid
              columnWidth={200}
            >
              {allData.map((obj) => 
                <Fragment key={idGenerator()}> 
                  {obj.code && <div style={{
                    width: "150px",
                    height: "150px",
                    background: "lightblue"
                  }}>Promo Code {obj.code}</div>}
                  {obj.video && <Video video={obj.video} />}
                </Fragment>
              )}
            </StackGrid>
          </div>

          
        )
      }}
    </Query>
  )
}

{/* <button
  style={{
    border: "1px solid gray",
    borderRadius: "10px",
    padding: "10px 20px",
  }}
  onClick={() => { 
    removeCookie(COOKIE_USER_TOKEN) 
    removeCookie(COOKIE_USER_ID) 
    window.location.assign('/');
  }}
>LOG OUT</button> */}