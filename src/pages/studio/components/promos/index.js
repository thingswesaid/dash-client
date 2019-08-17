import React from 'react';
import { Query } from 'react-apollo';
import idGenerator from 'react-id-generator';

import { PROMOS_HISTORY_QUERY } from '../../../../operations/queries';
import Loader from '../../../../shared-components/loader';
import Error from '../../../../shared-components/error';

import './index.css'; 

export default ({ from, to }) => (
  <Query query={PROMOS_HISTORY_QUERY} variables={{ from, to }}>
    {({ loading, error, data }) => {
      if (loading) { return <div />; }
      else if (error) { return <Error message="We will be right back!" />; }

      const { scheduledPromos } = data;

      return (
        <div className="promoAnalytics">
          <p className="title">SCHEDULED PROMOS</p>
          {!scheduledPromos.length && <div className="noPromos">NO SCHEDULED PROMOS</div>}
          <div className="promos">
            {scheduledPromos.map(({ promo: { promoOffer, startDate, endDate }, hasVideos }) => (
              <div key={idGenerator()} className={`promo ${promoOffer}`}>
                <div className="left">
                  <p>{promoOffer}</p>
                  <p>{hasVideos ? 'SPECIFIC' : 'GLOBAL'}</p> 
                </div>
                <div className="separator" />
                <div className="right">
                  <p>ACTIVE</p>
                  <p>{startDate.slice(0, 16)}</p>
                  <p>{endDate.slice(0, 16)}</p>
                </div>
              </div>
            ))}
            <div className="newPromo">CREATE NEW PROMO</div>
          </div>
        </div>
      )
    }}
  </Query>
)
