/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react';
import { Adopt } from 'react-adopt';
import YouTube from 'react-youtube';
import classNames from 'classnames';
import { toast as addNotification } from 'react-toastify';

import { getVideoQuery } from '../../operations/queries';
import { addUserIpMutation, createAnonymousIpMutation } from '../../operations/mutations';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import VideoNotFound from './components/video-not-found';
import playButton from '../../assets/images/play-button.png';
import labelExtended from '../../assets/images/label-extended.png';
import labelPreview from '../../assets/images/label-preview.png';
import { EMAIL_REGEX } from '../../constants';
import './index.css';

const mapper = { getVideoQuery, addUserIpMutation, createAnonymousIpMutation };

// PAYPAL MAKE MULTIPLE ACCOUNTS IN CASE ONE GETS FROZEN
// add (i) right next to already purchased - pop up will explain the email used for purchase
// implement paypal sandbox and test
// capture email address (from paypal?)
// check if paypal module includes GPAY | APPLE PAY
// build video suggestion section on the left
// fix hover issue on video images
// look into teespring for api / display product (or just store image and link in DB)
// implement lazyloading for images
// build Mobile view
// check user status and ip blocked before showing the page

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
      emailField: '',
      cookieEmail: '',
      userCheck: false,
      users: [],
    };
  }

  componentDidMount() {
    const { cookieEmail } = this.props;
    this.setState({ cookieEmail });
  }

  checkUserVideoAccess(video, addUserIp) {
    const { props: { userIp }, state: { paypalAppended, cookieEmail, emailField } } = this;
    const { users } = video;
    const user = users.filter(({ email }) => email === cookieEmail || email === emailField)[0];

    if (!user) {
      if (!paypalAppended) this.generatePaypalButtons();
      else this.setState({ showPayment: true });
      return undefined;
    }
    const hasIp = user.ips.includes(userIp);
    if (!hasIp) {
      const { ips, email } = user;
      addUserIp({ variables: { email, ips: [...ips, userIp] } });
    }
    this.setState({
      hasAccess: true,
      videoOpen: true,
      showPayment: false,
      users,
    });
    return user;
  }

  emailFieldUpdate(event) {
    this.setState({ emailField: event.target.value });
  }

  findEmailForVideo(video, addUserIp) {
    const { cookieEmail, emailField } = this.state;
    const valid = EMAIL_REGEX.test(String(emailField).toLowerCase());
    if (!valid) {
      return addNotification.info(
        'Email format not valid.', // move to constants
        { className: 'notification notificationError' },
      );
    }

    const user = this.checkUserVideoAccess(video, addUserIp);
    if (!user) {
      return addNotification(
        'Email not found. Select your payment method below.',
        { className: 'notification' },
      );
    } if (cookieEmail !== emailField) {
      document.cookie = `user-email=${emailField};path=/`;
      return this.setState({ cookieEmail: emailField });
    }
    return undefined;
  }

  async generatePaypalButtons() {
    const { amount } = this.state;
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
      onApprove(data, actions) {
        return actions.order.capture().then((details) => {
          console.log('>>>>>>>>> APPROVE2 <<<<<<<<<', details);
          // create user if doesn't exist and add to video's users
          // store payment id as well
        });
      },
    }).render('#paypal-button-container');
    this.setState({ paypalAppended: true, showPayment: true });
  }

  cfh(createAnonymousIp) {
    const {
      users, emailField, cookieEmail,
    } = this.state;
    const { userIp } = this.props;
    const user = users.filter(({ email }) => email === cookieEmail || email === emailField)[0];
    if (!user) {
      createAnonymousIp(userIp);
    }
    this.setState({ userCheck: true });
  }

  render() {
    const { videoId, userIp } = this.props;
    const {
      videoOpen, showPreview, hasAccess, showPayment, userCheck,
    } = this.state;
    const videoLabel = showPreview ? labelPreview : labelExtended;
    console.log('=======================');
    console.log('>>>>>>>>> STATE <<<<<<<<<<', this.state);
    console.log('=======================');
    return (
      <Fragment>
        <Adopt mapper={mapper} id={videoId} ip={userIp} videoComponent={this}>
          {({
            getVideoQuery: getVideo,
            addUserIpMutation: addUserIp,
            createAnonymousIpMutation: createAnonymousIp,
          }) => {
            const { data, loading, error } = getVideo;
            if (loading) { return <Loader />; }
            if (error) { return <Error error={error} />; } /* log to sumo or similar */
            if (!data.videos.length || !data.videos[0].published) { return <VideoNotFound />; }

            const video = data.videos[0];
            const {
              image, link, preview,
            } = video;

            if (hasAccess && !userCheck) { this.cfh(createAnonymousIp); }
            // move to componentDidUpdate and implement onCompleted in Mutation

            return (
              <Fragment>
                <div className="page">
                  <div className="suggestion" />

                  <div className={classNames('cardsContainer', { showPayment })}>
                    <div className="videoContainer shadow">
                      <div className="videoPlayer">
                        <img src={videoLabel} className="videoLabel" alt="video label" />
                        { videoOpen || (hasAccess && videoOpen) ? (
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
                              onClick={() => { this.checkUserVideoAccess(video, addUserIp); }}
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
                            <input
                              placeholder="YOUR EMAIL ADDRESS"
                              onChange={this.emailFieldUpdate.bind(this)}
                              onKeyDown={(e) => { if (e.key === 'Enter') { this.findEmailForVideo(video, addUserIp); } }}
                            />
                            <button type="submit" onClick={() => { this.findEmailForVideo(video, addUserIp); }}>GO</button>
                          </div>
                        </div>
                        <div id="paypal-button-container" />
                        <button
                          type="button"
                          className="videoBackButton"
                          onClick={() => {
                            this.setState({ showPayment: false, videoOpen: false });
                          }}
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
                          this.setState({
                            showPreview: !showPreview, videoOpen: !showPreview, showPayment: false,
                          });
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
        </Adopt>
      </Fragment>
    );
  }
}
