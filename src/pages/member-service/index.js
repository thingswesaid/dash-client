import React, { Component, Fragment } from 'react';
import { Adopt } from 'react-adopt';
import classNames from 'classnames';
import idGenerator from 'react-id-generator';
import ToggleButton from 'react-toggle-button';

import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import Image from '../../shared-components/image';
import PromoCode from '../user-page/components/promo-code';
import { userPageQuery } from '../../operations/queries';
import { userSubscription } from '../../operations/subscriptions';
import { 
  updateUserMutation, 
  createManualOrderMutation, 
  createManualPromoMutation,
} from '../../operations/mutations';

import './index.css';

const mapper = {
  userPageQuery,
  updateUserMutation,
  createManualOrderMutation,
  createManualPromoMutation,
  userSubscription,
};

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.emailInput = React.createRef();
    this.state = {
      refetching: false,
      userEmail: '',
      promoToggleZod: true,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { userEmail } = this.state;
    const { userEmail: updatedUserEmail } = nextState;
    if (userEmail !== updatedUserEmail ) return false;
    return true;
  }

  render() {
    const { state: { refetching, userEmail, promoToggleZod }, props: { userId } } = this;
    return (
      <Adopt mapper={mapper} id={userId} email={userEmail}>
        {({ 
          userPageQuery: userPageData, 
          updateUserMutation: updateUser, 
          createManualOrderMutation: createManualOrder,
          createManualPromoMutation: createManualPromo,
          userSubscription: userSub,
        }) => {
          const { data, loading, error, refetch: fetchUser } = userPageData;
          if (loading) { return <Loader />; }
          else if (error) { return <Error message="We will be right back!" />; }
          if (!data.userPage.user) return <div className="noUserFound">NO USER FOUND</div>;
          
          const {
            userPage: { 
              user: {
                email,
                role,
                orders,
                videos,
                active,
                password,
                promoCodes,
                subscribeNews,
                subscribePromo,
                subscribeEarlyAccess,
                ips,
              } 
            } 
          } = data;

          const subActive = userSub.data ? userSub.data.user.active : undefined;
          const isActive = subActive !== undefined ? subActive : active;
          const isActiveFormatted = isActive ? 'TRUE' : 'FALSE';
          const isSignedUp = password && password.length;
          if (!refetching && role !== "ADMIN") return window.location.assign('/');

          console.log('promoToggleZod', promoToggleZod);

          return (
            <Fragment>
              <div className="userSearch">
                <input 
                  placeholder="user email" 
                  ref={this.emailInput}
                  onChange={(e) => { this.setState({ userEmail: e.target.value.replace(/\s/g, '') }) }}
                  onKeyPress={e => { 
                    if (e.key === 'Enter') {
                      this.setState({ refetching: true }, () => {
                        fetchUser({ email: this.state.userEmail })
                      });
                    }
                  }}
                />
                <button
                  onClick={() => this.setState({ refetching: true }, () => 
                    fetchUser({ email: this.state.userEmail })
                  )}
                >
                  SEARCH
                </button>
              </div>
              <div className="email">{email}</div>
              <div className="ips">IPS {ips.length}</div>
              <div className="data">
                <div 
                  className="section userActive" 
                  onClick={() => { 
                    updateUser({ 
                      variables: { 
                        email: this.state.userEmail, 
                        key: 'active', 
                        valueBoolean: !isActive 
                      } 
                    })
                  }}
                >
                  <h4>IS ACTIVE</h4>
                  <p className={classNames({ active: isActive })}>{isActiveFormatted}</p>
                </div> 

                <div className="section">
                  <h4>SIGNED UP</h4>
                  <p className={classNames({ active: isSignedUp })}>{isSignedUp ? 'TRUE' : 'FALSE'}</p>
                </div>
                <div className="section">
                  <h4>NEWS</h4>
                  <p className={classNames({ active: subscribeNews })}>{subscribeNews ? 'TRUE' : 'FALSE'}</p>
                </div>
                <div className="section">
                  <h4>PROMO</h4>
                  <p className={classNames({ active: subscribePromo })}>{subscribePromo ? 'TRUE' : 'FALSE'}</p>
                </div>
                <div className="section">
                  <h4>EARLY ACCESS</h4>
                  <p className={classNames({ active: subscribeEarlyAccess })}>{subscribeEarlyAccess ? 'TRUE' : 'FALSE'}</p>
                </div>
              </div>
              <div className="separatorHorizontal" />
              <div className="connects">
                <div className="ordersContainer">
                  <p>ORDERS ({ orders.length })</p>
                  <div className="orders">
                    {orders.map(({ createdAt, video: { id, keywords } }) => (
                      <a key={idGenerator()} href={`/video/${id.slice(-5)}`}>
                        <p>{createdAt.slice(0, 10)}</p>
                        <p>{keywords}</p>
                      </a>
                    ))}
                  </div>
                  <div className="addToDb">
                    <input 
                      placeholder="Add order (video id)" 
                      onKeyPress={e => { 
                        if (e.key === 'Enter') {
                          createManualOrder({
                            variables: { 
                              email: email,  
                              videoId: e.target.value.replace(/\s/g, ''),
                            }
                          });
                        };
                      }}
                    />
                  </div>
                </div>
                <span className="separatorVertical" />
                <div className="videosContainer">
                  <p>VIDEOS ({ videos.length })</p>
                  <div className="videos">
                    {videos.map(({ id, imageVertical }) => (
                      <a key={idGenerator()} href={`/video/${id.slice(-5)}`}>
                        <Image src={imageVertical} />
                      </a>
                    ))}
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
                  <div className="addPromo">
                    <i 
                      className="fas fa-plus" 
                      onClick={() => {
                        const type = promoToggleZod ? 'ZODIAC' : 'PICKACARD'
                        createManualPromo({ variables: { email, type } });
                      }}
                    />
                    <ToggleButton
                      inactiveLabel={<div>PICK</div>}
                      activeLabel={<div>ZOD</div>}
                      value={promoToggleZod}
                      colors={{ active: {base: '#97eb8d'}, inactive: {base: '#ffa84b'} }}
                      onToggle={(value) => { this.setState({ promoToggleZod: !value }) }} />
                  </div>
                </div>
              </div>
            </Fragment>
          )
        }}
      </Adopt>
    );
  }
};