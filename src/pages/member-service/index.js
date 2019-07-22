import React, { Component, Fragment } from 'react';
import { Adopt } from 'react-adopt';
import classNames from 'classnames';
import idGenerator from 'react-id-generator';

import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import Image from '../../shared-components/image';
import PromoCode from '../user-page/components/promo-code';
import { userPageQuery } from '../../operations/queries';
import { updateUserMutation } from '../../operations/mutations';
import { userSubscription } from '../../operations/subscriptions';

import './index.css';

const mapper = {
  userPageQuery,
  updateUserMutation,
  userSubscription,
};

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refetching: false,
      userEmail: '',
    };
  }

  render() {
    const { state: { refetching, userEmail }, props: { userId } } = this;
    return (
      <Adopt mapper={mapper} id={userId}>
        {({ userPageQuery: userPageData, updateUserMutation, userSubscription }) => {
          const { data, loading, error, refetch: fetchUser } = userPageData;
          const { data: userSubData } = userSubscription;
          if (loading) { return <Loader />; }
          else if (error) { return <Error message="We will be right back!" />; }
          
          const {
            userPage: { 
              user: {
                role,
                orders,
                videos,
                active,
                password,
                promoCodes,
                subscribeNews,
                subscribePromo,
                subscribeEarlyAccess,
              } 
            } 
          } = data;

          // const { user: { active } } = userSubData;

          console.log('userSubData', userSubscription);

          const isActive = active.toString().toUpperCase();
          const isSignedUp = password && password.length;
          if (!refetching && role !== "ADMIN") return window.location.assign('/');

          return (
            <Fragment>
              <div className="userSearch">
                <input 
                  placeholder="user email" 
                  value={userEmail}
                  onChange={e => this.setState({ userEmail: e.target.value }) }
                  onKeyPress={e => { 
                    if (e.key === 'Enter') {
                      this.setState({ refetching: true }, () => fetchUser({ email: userEmail }));
                    }
                  }}
                />
                <button
                  onClick={() => this.setState({ refetching: true }, () => fetchUser({ email: userEmail }))}
                >SEARCH</button>
              </div>
              <div className="data">
                <div 
                  className="section userActive" 
                  onClick={() => { updateUserMutation({ variables: { email: userEmail, key: 'active', valueBoolean: !active } }) }}
                >
                  <h4>IS ACTIVE</h4>
                  <p className={classNames({ active })}>{isActive}</p>
                </div>
                <div className="section">
                  <h4>SIGNED UP</h4>
                  <p className={classNames({ active: isSignedUp })}>{isSignedUp ? 'TRUE' : 'FALSE'}</p>
                </div>
                <div className="section">
                  <h4>SUB NEWS</h4>
                  <p className={classNames({ active: subscribeNews })}>{subscribeNews ? 'TRUE' : 'FALSE'}</p>
                </div>
                <div className="section">
                  <h4>SUB PROMO</h4>
                  <p className={classNames({ active: subscribePromo })}>{subscribePromo ? 'TRUE' : 'FALSE'}</p>
                </div>
                <div className="section">
                  <h4>SUB EARLY</h4>
                  <p className={classNames({ active: subscribeEarlyAccess })}>{subscribeEarlyAccess ? 'TRUE' : 'FALSE'}</p>
                </div>
              </div>
              <div className="connects">
                <div className="ordersContainer">
                  <p>ORDERS ({ orders.length })</p>
                  <div className="orders">
                    {orders.map(({ createdAt, video: { keywords } }) => (
                      <div key={idGenerator()}>
                        <p>{createdAt.slice(0, 10)}</p>
                        <p>{keywords}</p>
                      </div>
                    ))}
                  </div>
                  <div className="addToDb">
                    <input placeholder="Add video (video id)" />
                  </div>
                </div>
                <span className="separatorVertical" />
                <div className="videosContainer">
                  <p>VIDEOS ({ videos.length })</p>
                  <div className="videos">
                    {videos.map(({ imageVertical }) => (
                      <div key={idGenerator()}>
                        <Image src={imageVertical} />
                      </div>
                    ))}
                  </div>
                  <div className="addToDb">
                    <input placeholder="Add order (video id)" />
                  </div>
                </div>
              </div>
              <div className="separatorHorizontal" />
              <div className="promoCodes">
                <p>PROMO CODES ({ promoCodes.length })</p>
                <div className="codes">
                  {promoCodes.map((promoCode) => (
                    <div key={idGenerator()}>
                      <PromoCode promoCode={promoCode} />
                    </div>
                  ))}
                  {!promoCodes.length && <div>No promo codes found.</div>}
                </div>
              </div>
            </Fragment>
          )
        }}
      </Adopt>
    );
  }
};