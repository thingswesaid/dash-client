/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react';
import YouTube from 'react-youtube';
import classNames from 'classnames';
import { toast as notification } from 'react-toastify';
import { PayPalButton } from 'react-paypal-button-v2';
import * as Sentry from '@sentry/browser';

import {
  ACCOUNT_SUSPENDED,
  PAYMENT_ERROR,
  COOKIE_EMAIL,
  COOKIE_RECENT_ORDER,
} from '../../../../constants';
import Image from '../../../../shared-components/image';
import CallToAction from '../call-to-action';
import { getCookie, getWindowHeight, transactionToAnalytics } from '../../../../utils';
import Loader from '../../../../shared-components/loader';
import playButton from '../../../../assets/images/play-button.png';
import labelExtended from '../../../../assets/images/label-extended.png';
import labelPreview from '../../../../assets/images/label-preview.png';
import universe from '../../../../assets/images/universe-bg.jpg';
import heart from '../../../../assets/gifs/heart.gif';
import './index.css';

export default class MainVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      emailField: '',
      shrink: false,
      hasAccess: false,
      videoOpen: false,
      showPromo: false,
      showEmail: false,
      showPreview: false,
      showPayment: false,
      showEmailModal: false,
      showPromoModal: false,
      showEmailForPromo: false,
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

  checkUserVideoAccess = () => {
    const {
      props: { userIp, video: { users }, addUserIp },
      state: { emailField },
    } = this;

    
    const coookieRecentOrder = getCookie(COOKIE_RECENT_ORDER);
    if (coookieRecentOrder) {
      this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
      return user || undefined;
    } 
    
    const cookieEmail = getCookie(COOKIE_EMAIL);
    const user = users.filter(({ email }) => email === emailField || email === cookieEmail)[0];

    if (!user) {
      this.setState({ showPayment: true, videoOpen: false });
      return undefined;
    }
    const hasIp = user.ips.includes(userIp);
    if (!!userIp && !hasIp) {
      const { ips, email } = user;
      addUserIp({ variables: { email, ips: [...ips, userIp] } });
    }

    if (!user.active) {
      return notification.error(ACCOUNT_SUSPENDED);
    }
    this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
    return user;
  }

  emailFieldUpdate = (value) => {
    const emailField = value.replace(/\s/g, "");
    this.setState({ emailField });
  }

  giveUserAccess = () => {
    this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
  }

  async processPayment(payment, videoId, price, videoName, type, createOrder) {
    try {
      const { userIp } = this.props;
      const {
        payer: {
          email_address: email,
          name: { given_name: firstName, surname: lastName },
          phone,
        },
        purchase_units: purchase,
        status,
      } = payment;

      const { payments: { captures } } = purchase[0];
      const { id: paymentId } = captures[0];

      if (status !== 'COMPLETED') { // look into statuses and still create order
        notification.error(PAYMENT_ERROR);
        return this.setState({ loading: false });
      }

      const phoneNumber = phone ? phone.phone_number.national_number : undefined;
      const ip = userIp || 'IP-NOT-RECEIVED';

      const { data: { createOrder: orderResponse }} = await createOrder({
        variables: {
          email: email.toLowerCase(),
          ips: [ip],
          videoId,
          phone: phoneNumber,
          firstName,
          lastName,
          paymentId,
          type,
        },
      });

      document.cookie = `${COOKIE_EMAIL}=${email.toLowerCase()};`;
      document.cookie = `${COOKIE_RECENT_ORDER}=true`;

      transactionToAnalytics(dataLayer, {
        videoName,
        videoId,
        price,
        paymentId,
      });

      this.setState({
        hasAccess: true,
        videoOpen: true,
        showPreview: false,
        showPayment: false,
        loading: false,
      });

      if (orderResponse && orderResponse.code) {
        notification.success(
          `🎉 New promo code: ${orderResponse.code.toUpperCase()}`, 
          { closeOnClick: false, autoClose: false }
        );
      }
      return undefined;
    } catch (error) {
      notification.error(PAYMENT_ERROR);
      Sentry.captureException(`MAIN-VIDEO:processPayment:error - ${error}`);
      return this.setState({ loading: false });
    }
  }

  render() {
    const {
      state: {
        showPreview,
        showPayment,
        emailField,
        videoOpen,
        hasAccess,
        loading,
        shrink,
      },
      props: { video, createOrder, sitePromo },
    } = this;

    const {
      id: queryVideoId, name, image, placeholder, link, preview, start, price, type,
    } = video;

    const hasDiscount = sitePromo && sitePromo.promoOffer === "DISCOUNT";
    const videoLabel = showPreview ? labelPreview : labelExtended;

    return (
      <Fragment>
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
                    animate
                  />
                </Fragment>
              )}
            </div>
            <div className="payments" style={{ background: `url(${universe}) no-repeat`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
              <div className="title">30 SECOND CHECKOUT</div>
              <div className="payPalWrapper">
                {
                  hasDiscount ? <div className="priceDiscounted">${sitePromo.newPrice.toFixed(2)}</div> : ""
                }
                <div className={classNames('price', { hasDiscount })}>
                $
                  {price}
                </div>
                <PayPalButton
                  createOrder={(data, actions) => actions.order.create({
                    purchase_units: [{
                      amount: {
                        currency_code: 'USD',
                        value: sitePromo ? sitePromo.newPrice : price,
                      },
                    }],
                    application_context: {
                      shipping_preference: 'NO_SHIPPING',
                    },
                  })}
                  onApprove={async (_data, actions) => {
                    try {
                      this.setState({ loading: true });
                      const payment = await actions.order.capture();
                      this.processPayment(payment, queryVideoId, price, name, type, createOrder);
                    } catch (error) {
                      notification.error(PAYMENT_ERROR);
                      Sentry.captureException(`MAIN-VIDEO:onApprove - ${error}`);
                      return this.setState({ loading: false });
                    }
                  }}
                  options={{
                    clientId: process.env.NODE_ENV === 'production'
                      ? process.env.REACT_APP_PAYPAL_CLIENT_ID
                      : process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
                  }}
                />
              </div>
              <div className="paymentSeparator" />
              <CallToAction
                checkUserVideoAccess={this.checkUserVideoAccess}
                emailFieldUpdate={this.emailFieldUpdate}
                giveUserAccess={this.giveUserAccess}
                emailField={emailField}
                videoId={queryVideoId}
                videoType={type}
              />
              <button
                type="button"
                className="videoBackButton"
                onClick={() => {
                  this.setState({ showPayment: false, videoOpen: false });
                }}
              >
                CLOSE
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
