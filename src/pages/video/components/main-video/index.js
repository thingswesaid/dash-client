/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react';
import YouTube from 'react-youtube';
import classNames from 'classnames';
import { toast as addNotification } from 'react-toastify';
import { PayPalButton } from 'react-paypal-button-v2';
import Image from '../../../../shared-components/image';

import { getCookie } from '../../../../utils';
import Modal from '../../../../shared-components/modal';
import playButton from '../../../../assets/images/play-button.png';
import labelExtended from '../../../../assets/images/label-extended.png';
import labelPreview from '../../../../assets/images/label-preview.png';
import emailExampleGif from '../../../../assets/images/email-example.gif';
import { EMAIL_REGEX } from '../../../../constants';
import './index.css';

export default class MainVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: false,
      videoOpen: false,
      showPreview: false,
      showPayment: false,
      userCheck: false,
      showModal: false,
      emailField: '',
    };
  }

  checkUserVideoAccess() {
    const {
      props: { userIp, video: { users }, addUserIp },
      state: { emailField },
    } = this;
    const cookieEmail = getCookie('dash-user-email');
    const user = users.filter(({ email }) => email === cookieEmail || email === emailField)[0];
    if (!user) {
      this.setState({ showPayment: true, videoOpen: false });
      return undefined;
    }
    const hasIp = user.ips.includes(userIp);
    if (!hasIp) {
      const { ips, email } = user;
      addUserIp({ variables: { email, ips: [...ips, userIp] } });
    }
    this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
    return user;
  }

  emailFieldUpdate(event) {
    this.setState({ emailField: event.target.value });
  }

  findEmailForVideo() {
    const { emailField } = this.state;
    const cookieEmail = getCookie('dash-user-email');
    const valid = EMAIL_REGEX.test(String(emailField).toLowerCase());
    if (!valid) {
      return addNotification.info(
        'Email format not valid.', // TODO move to constants
        { className: 'notification notificationError' },
      );
    }

    const user = this.checkUserVideoAccess();
    if (!user) {
      return addNotification(
        'Email not found. Select your payment method below.',
        { className: 'notification' },
      );
    } if (cookieEmail !== emailField) {
      document.cookie = `dash-user-email=${emailField};`;
    }
    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  async processPayment(payment, videoId, addUserToVideo) {
    const { userIp, refetchVideo } = this.props;
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
        'There was an error with the payment. Please try again later.',
        { className: 'notification notificationError' },
      );
    }

    const phoneNumber = phone ? phone.phone_number.national_number : undefined;

    addUserToVideo({
      variables: {
        email,
        ips: [userIp],
        videoId,
        phone: phoneNumber,
        firstName,
        lastName,
        paymentId,
      },
    });

    document.cookie = `dash-user-email=${email};`;

    this.setState({
      hasAccess: true,
      videoOpen: true,
      showPreview: false,
      showPayment: false,
    });
    await refetchVideo();
    return undefined;
  }

  cfh() {
    const { emailField } = this.state;
    const { userIp, video: { users }, createAnonymousIp } = this.props;
    const cookieEmail = getCookie('dash-user-email');
    const user = users.filter(({ email }) => email === cookieEmail || email === emailField)[0];
    if (!user) {
      createAnonymousIp(userIp);
    }
    this.setState({ userCheck: true });
  }

  render() {
    const {
      videoOpen, showPreview, hasAccess, showPayment, userCheck, showModal,
    } = this.state;

    const {
      video, addUserToVideo, addUserIp,
    } = this.props;

    const {
      id: queryVideoId, image, placeholder, link, preview, start, amount,
    } = video;
    const videoLabel = showPreview ? labelPreview : labelExtended;

    if (hasAccess && !userCheck) { this.cfh(); }
    // TODO move Modal text to constants
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
        <div className={classNames('cardsContainer', { showPayment })}>
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
                  <Image image={image} placeholder={placeholder} className="videoPlaceholder" />
                </Fragment>
              )}
            </div>
            <div className="payments">
              <div className="videoPrice">ONLY $4.99</div>
              {/* TODO make amount dynamic */}
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
                    placeholder="YOUR EMAIL ADDRESS"
                    onChange={this.emailFieldUpdate.bind(this)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { this.findEmailForVideo(video, addUserIp); } }}
                  />
                  <button type="submit" onClick={() => { this.findEmailForVideo(video, addUserIp); }}>GO</button>
                </div>
              </div>
              <div className="payPalWrapper">
                <PayPalButton
                  amount={amount}
                  onApprove={async (_data, actions) => {
                    const payment = await actions.order.capture();
                    this.processPayment(payment, queryVideoId, addUserToVideo);
                  }}
                  options={{
                    // TODO from process.env
                    clientId: 'AVYEH5XBfGFK5w3jgYL0HJWYrX5OleyMe31cugWyj7HC8nY4C2VYk-INYGqzmqB9ecJyQpe2cb5khiD-',
                  }}
                />
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
WATCH
              {' '}
              {showPreview ? 'EXTENDED' : 'PREVIEW'}
            </p>
          </button>
        </div>
      </Fragment>
    );
  }
}
