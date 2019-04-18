/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import YouTube from 'react-youtube';
import classNames from 'classnames';

import './index.css';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import VideoNotFound from './components/video-not-found';
import playButton from '../../assets/images/play-button.png';
import { VIDEO_QUERY } from '../../operations/queries';
import { ADD_USER_IP_MUTATION } from '../../operations/mutations';

import labelExtended from '../../assets/images/label-extended.png';
import labelPreview from '../../assets/images/label-preview.png';

// TODO break in smaller components
export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: false,
      videoOpen: false,
      showPreview: false,
      paypalAppended: false,
      showPayment: false,
      amount: 0,
    };
  }

  checkUserVideoAccess(video, addUserIp) {
    const { userEmail, userIp } = this.props;
    const { paypalAppended } = this.state;
    const { users, amount } = video;
    const user = users.filter(({ email }) => email === userEmail)[0];
    if (user) {
      const hasIp = user.ips.includes(userIp);
      if (!hasIp) {
        const { ips } = user;
        addUserIp({ variables: { email: userEmail, ips: [...ips, userIp] } });
      }
    }
    this.setState({ hasAccess: !!user, videoOpen: !!user });
    if (!user) {
      if (!paypalAppended) this.generatePaypalButtons(amount);
      else this.setState({ showPayment: true });
    } else if (user) {
      this.setState({ hasAccess: true, videoOpen: true });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generatePaypalButtons(amount) {
    paypal.Buttons({
      createOrder(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount,
            },
          }],
        });
      },

      onApprove(data, actions) { // will work on this
        return actions.order.capture().then((details) => {
          alert(`Transaction completed by ${details.payer.name.given_name}!`);
        });
      },
    });
    paypal.Buttons().render('#paypal-button-container');
    this.setState({ paypalAppended: true, showPayment: true });
  }

  // add back to video when payments is showing
  render() {
    const { videoId } = this.props;
    const {
      videoOpen, showPreview, hasAccess, showPayment,
    } = this.state;
    const videoLabel = showPreview ? labelPreview : labelExtended;

    return (
      <Mutation mutation={ADD_USER_IP_MUTATION}>
        {addUserIp => (
          <Query
            query={VIDEO_QUERY}
            variables={{ id: videoId }}
            // onCompleted={data => this.setUserVideoAccess(data.videos[0].users, addUserIp)}
          >
            {({ data, loading, error }) => {
              if (loading) { return <Loader />; }
              if (error) { return <Error />; } /* log to sumo or similar */
              if (!data.videos.length) { return <VideoNotFound />; }

              const {
                image, link, preview, users, amount, published,
              } = data.videos[0];

              if (!published) { return <VideoNotFound />; }

              return (
                <Fragment>
                  <div className="page">
                    <div className="suggestion" />

                    <div className={classNames('cardsContainer', { showPayment })}>
                      <div className="videoContainer shadow">
                        <div className="videoPlayer">
                          <img src={videoLabel} className="videoLabel" alt="video label" />
                          { videoOpen ? (
                            <YouTube
                              videoId={showPreview ? preview : link}
                              opts={{
                                playerVars: {
                                  autoplay: 1,
                                },
                              }}
                            />
                          ) : (
                            <Fragment>
                              <button
                                type="button"
                                className="playButton"
                                onClick={() => { this.checkUserVideoAccess(data.videos[0], addUserIp); }}
                                onKeyPress={() => { this.setState({ videoOpen: true }); }}
                              >
                                <img src={playButton} alt="play button" />
                              </button>
                              <img src={image} className="videoPlaceholder" alt="placeholder" />
                            </Fragment>
                          )}
                        </div>
                        <div className="payments">
                          <div className="videoPrice">ONLY $4.99</div>
                          <div className="emailField">
                            <p>ALREADY PURCHASED?</p>
                            <div>
                              <input placeholder="YOUR EMAIL ADDRESS" />
                              <button>GO</button>
                            </div>
                          </div>
                          <div id="paypal-button-container" />
                          <button
                            className="videoBackButton"
                            onClick={() => { this.setState({ showPayment: false }); }}
                          >
                              BACK
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="showLabel"
                        onClick={() => {
                          if (showPreview) {
                            this.checkUserVideoAccess(data.videos[0], addUserIp);
                            this.setState({ showPreview: !showPreview });
                          } else {
                            this.setState({ showPreview: !showPreview, videoOpen: !showPreview, showPayment: false });
                          }
                        }}
                        onKeyPress={() => {
                          if (showPreview) {
                            this.checkUserVideoAccess(data.videos[0], addUserIp);
                            this.setState({ showPreview: !showPreview });
                          } else {
                            this.setState({ showPreview: !showPreview, videoOpen: !showPreview });
                          }
                        }}
                      >
                        <div className="arrowDown" />
                        <p>
                          WATCH
                          {' '}
                          {showPreview ? 'EXTENDED' : 'PREVIEW'}
                        </p>
                      </button>
                    </div>

                    <div className="ads" />
                  </div>
                  <div className="merch" />
                </Fragment>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}
