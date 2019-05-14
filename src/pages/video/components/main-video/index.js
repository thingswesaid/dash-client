/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react';
import YouTube from 'react-youtube';
import classNames from 'classnames';
import { toast as addNotification } from 'react-toastify';
import { PayPalButton } from 'react-paypal-button-v2';

import {
  EMAIL_NOT_VALID,
  EMAIL_NOT_FOUND,
  ACCOUNT_SUSPENDED,
  PAYMENT_ERROR,
  COOKIE_EMAIL,
  COOKIE_RECENT_ORDER,
  EMAIL_REGEX,
} from '../../../../constants';
import Image from '../../../../shared-components/image';
import { getCookie, getWindowHeight } from '../../../../utils';
import Modal from '../../../../shared-components/modal';
import Loader from '../../../../shared-components/loader';
import playButton from '../../../../assets/images/play-button.png';
import labelExtended from '../../../../assets/images/label-extended.png';
import labelPreview from '../../../../assets/images/label-preview.png';
import emailExampleGif from '../../../../assets/images/email-example.gif';
import universe from '../../../../assets/images/universe-bg.jpg';

import heart from '../../../../assets/gifs/heart.gif';
import './index.css';

export default class MainVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: false,
      videoOpen: false,
      showPreview: false,
      showPayment: false,
      showModal: false,
      shrink: false,
      emailField: '',
      loading: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      getWindowHeight(20, this);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => {
      getWindowHeight(20, this);
    });
  }

  checkUserVideoAccess() {
    const {
      props: { userIp, video: { users }, addUserIp },
      state: { emailField },
    } = this;

    const cookieEmail = getCookie(COOKIE_EMAIL);
    const coookieRecentOrder = getCookie(COOKIE_RECENT_ORDER);
    const user = users.filter(({ email }) => email === emailField || email === cookieEmail)[0];

    if (coookieRecentOrder) {
      this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
      return user || undefined;
    } if (!user) {
      this.setState({ showPayment: true, videoOpen: false });
      return undefined;
    }
    const hasIp = user.ips.includes(userIp);
    if (!!userIp && !hasIp) {
      const { ips, email } = user;
      addUserIp({ variables: { email, ips: [...ips, userIp] } });
    }

    if (!user.active) {
      return addNotification.error(
        ACCOUNT_SUSPENDED,
        { className: 'notification notificationError' },
      );
    }
    this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
    return user;
  }

  emailFieldUpdate(event) {
    this.setState({ emailField: event.target.value.toLowerCase() });
  }

  findEmailForVideo() {
    const { emailField } = this.state;
    const cookieEmail = getCookie(COOKIE_EMAIL);
    const valid = EMAIL_REGEX.test(String(emailField).toLowerCase());
    if (!valid) {
      return addNotification.info(
        EMAIL_NOT_VALID,
        { className: 'notification notificationError' },
      );
    }

    const user = this.checkUserVideoAccess();
    if (!user) {
      return addNotification(
        EMAIL_NOT_FOUND,
        { className: 'notification' },
      );
    } if (cookieEmail !== emailField) {
      document.cookie = `${COOKIE_EMAIL}=${emailField};`;
    }
    return undefined;
  }

  async processPayment(payment, videoId, addUserToVideo) {
    const { userIp } = this.props;
    const {
      id: paymentId,
      payer: {
        email_address: email,
        name: { given_name: firstName, surname: lastName },
        phone,
      },
      status,
    } = payment;

    if (status !== 'COMPLETED') {
      return addNotification.info(
        PAYMENT_ERROR,
        { className: 'notification notificationError' },
      );
    }

    const phoneNumber = phone ? phone.phone_number.national_number : undefined;
    const ip = userIp || 'IP-NOT-RECEIVED';

    addUserToVideo({
      variables: {
        email: email.toLowerCase(),
        ips: [ip],
        videoId,
        phone: phoneNumber,
        firstName,
        lastName,
        paymentId,
      },
    });

    document.cookie = `${COOKIE_EMAIL}=${email.toLowerCase()};`;
    document.cookie = `${COOKIE_RECENT_ORDER}=true`;

    this.setState({
      hasAccess: true,
      videoOpen: true,
      showPreview: false,
      showPayment: false,
    });
    return undefined;
  }

  render() {
    const {
      state: {
        videoOpen, showPreview, hasAccess, showPayment, showModal, shrink, loading,
      },
      props: { video, addUserToVideo, addUserIp },
    } = this;

    const {
      id: queryVideoId, image, placeholder, link, preview, start, amount,
    } = video;
    const videoLabel = showPreview ? labelPreview : labelExtended;

    return (
      <Fragment>
        { showModal
          ? (
            <Modal
              title="I already purchased this video, how can I watch it again?"
              text="If you previously purchased this extended video, make sure to type the email address you used at checkout and we will be able to grant you access right away."
              image={emailExampleGif}
              onClick={() => { this.setState({ showModal: false }); }}
            />
          )
          : ''
        }
        {loading
          ? (
            <Loader
              custom
              classContainer="loaderContainer"
              classContent="content"
              image={heart}
              title="Thank you for your purchase!"
              description="We are processing your payment"
            />
          ) : ''}
        <div className={classNames('cardsContainer', { showPayment, shrink })}>
          <div className="videoContainer">
            <div className="videoPlayer">
              <img src={videoLabel} className="videoLabel" alt="video label" />
              { videoOpen || (hasAccess && videoOpen) ? (
                <YouTube
                  videoId={showPreview ? preview : link}
                  opts={{
                    playerVars: {
                      autoplay: 1,
                      modestbranding: 1,
                      rel: 0,
                      start: !showPreview ? start : 0,
                    },
                  }}
                />
              ) : (
                <Fragment>
                  <button
                    type="button"
                    className="playButton"
                    onClick={() => { this.checkUserVideoAccess(); }}
                    onKeyPress={() => { this.setState({ videoOpen: true }); }}
                  >
                    <img src={playButton} alt="play button" />
                  </button>
                  <Image
                    src={image}
                    placeholder={placeholder}
                    className="videoPlaceholder"
                  />
                </Fragment>
              )}
            </div>
            <div className="payments" style={{ background: `url(${universe}) no-repeat`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
              <div className="title">CHECKOUT</div>
              <div className="price">
              $
                {amount}
              </div>
              <div className="payPalWrapper">
                <PayPalButton
                  createOrder={(data, actions) => actions.order.create({
                    purchase_units: [{
                      amount: {
                        currency_code: 'USD',
                        value: amount,
                      },
                    }],
                    application_context: {
                      shipping_preference: 'NO_SHIPPING',
                    },
                  })}
                  onApprove={async (_data, actions) => {
                    this.setState({ loading: true });
                    const payment = await actions.order.capture();
                    this.processPayment(payment, queryVideoId, addUserToVideo);
                    this.setState({ loading: false });
                  }}
                  options={{
                    clientId: process.env.NODE_ENV === 'production'
                      ? process.env.REACT_APP_PAYPAL_CLIENT_ID
                      : process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
                  }}
                />
              </div>
              <div className="paymentSeparator" />
              <div className="emailField">
                <div className="alreadyPurchased">
                  <p>ALREADY PURCHASED?</p>
                  <i
                    className="fas fa-info-circle"
                    onClick={() => { this.setState({ showModal: true }); }}
                    onKeyDown={() => { this.setState({ showModal: true }); }}
                    role="button"
                    tabIndex={0}
                  />
                </div>
                <div>
                  <input
                    placeholder="Enter Your Email Address"
                    onChange={this.emailFieldUpdate.bind(this)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { this.findEmailForVideo(video, addUserIp); } }}
                  />
                  <button type="submit" onClick={() => { this.findEmailForVideo(video, addUserIp); }}>GO</button>
                </div>
              </div>
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
                this.checkUserVideoAccess();
                this.setState({ showPreview: !showPreview });
              } else {
                this.setState({
                  showPreview: !showPreview, videoOpen: !showPreview, showPayment: false,
                });
              }
            }}
            onKeyPress={() => {
              if (showPreview) {
                this.checkUserVideoAccess();
                this.setState({ showPreview: !showPreview });
              } else {
                this.setState({ showPreview: !showPreview, videoOpen: !showPreview });
              }
            }}
          >
            <p>
              SWITCH TO
              {' '}
              {showPreview ? 'EXTENDED' : 'PREVIEW'}
            </p>
          </button>
        </div>
      </Fragment>
    );
  }
}
