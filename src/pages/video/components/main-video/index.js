/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react';
import YouTube from 'react-youtube';
import classNames from 'classnames';
import _ from 'lodash';
import { toast as notification } from 'react-toastify';
import { PayPalButton } from 'react-paypal-button-v2';
import * as Sentry from '@sentry/browser';

import {
  ACCOUNT_SUSPENDED,
  PAYMENT_ERROR,
  COOKIE_USER_TOKEN,
  COOKIE_RECENT_ORDER,
  COOKIE_PAYPAYL_EMAIL,
  COOKIE_USER_ID,
} from '../../../../constants';
import Modal from '../../../../shared-components/modal';
import { setCookie } from '../../../../cookieUtils';
import Image from '../../../../shared-components/image';
import PromoCode from '../promo-code';
import Labels from '../labels';
import { transactionToAnalytics } from '../../../../utils';
import { getCookie } from '../../../../cookieUtils';
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
      optionSelected: 0,
      loading: false,
      hasAccess: false,
      videoOpen: false,
      showPreview: true,
      showPayment: false,
      showPromoModal: false,
    };
  }

  checkUserVideoAccess = (showPreview) => {
    const { userIp, video: { users }, addUserIp } = this.props;
    const coookieRecentOrder = getCookie(COOKIE_RECENT_ORDER);
    if (coookieRecentOrder || showPreview) {
      this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
      return user || undefined;
    } 
    
    const userId = getCookie(COOKIE_USER_ID);
    const user = users.filter(({ id }) => id === userId)[0];
    
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

    this.setState({ hasAccess: true, videoOpen: true, showPayment: false, showPreview: false });
    return user;
  }

  giveUserAccess = () => {
    this.setState({ hasAccess: true, videoOpen: true, showPayment: false });
  }

  async processPayment(payment, videoId, price, videoName, type, createOrder) {
    try {
      const {
        payer: {
          email_address: payPalEmail,
          name: { given_name: firstName, surname: lastName },
        },
        purchase_units: purchase,
        status,
      } = payment;

      if (status !== 'COMPLETED') {
        notification.error(PAYMENT_ERROR);
        return this.setState({ loading: false });
      }
      setCookie(COOKIE_RECENT_ORDER, true);
      const { payments: { captures } } = purchase[0];
      const { id: paymentId } = captures[0];
      const userToken = getCookie(COOKIE_USER_TOKEN);
      if (!userToken) setCookie(COOKIE_PAYPAYL_EMAIL, payPalEmail);

      const ip = this.props.userIp || 'IP-NOT-RECEIVED';
      const { 
        data: { 
          createOrder: { promo } 
        }
      } = await createOrder({
        variables: {
          userToken,
          ips: [ip],
          videoId,
          firstName,
          lastName,
          paymentId,
          type,
          paymentEmail: payPalEmail,
          amount: price,
        },
      });

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

      if (promo && promo.code) {
        notification.success(
          `🎉 New promo code: ${promo.code.toUpperCase()}`, 
          { closeOnClick: false, autoClose: false }
        );
      }
      return undefined;
    } catch (error) {
      notification.error(PAYMENT_ERROR);
      Sentry.captureException(
        `
          MAIN-VIDEO:processPayment:error
          ${error}
          ${this.props.user}
          ${this.props.video}
        `
      );
      return this.setState({ loading: false });
    }
  }

  render() {
    const {
      state: {
        optionSelected,
        showPromoModal,
        showPreview,
        showPayment,
        videoOpen,
        hasAccess,
        loading,
      },
      props: { video, createOrder, sitePromo, location },
    } = this;

    const {
      id: queryVideoId, name, image, placeholder, link, preview, start, price, type, options
    } = video;

    const linkToVideo = options.length ? options[optionSelected] : link;
    const hasDiscount = sitePromo && sitePromo.promoOffer === "DISCOUNT";
    const videoLabel = showPreview ? labelPreview : labelExtended;
    const showVideo = videoOpen || (hasAccess && videoOpen);
    const isIndia = location === 'IN';
    const shownPrice = isIndia ? 1.99 : price;
    
    let videoPrice;
    if (isIndia) videoPrice = 1.99;
    else if (hasDiscount) videoPrice = sitePromo.newPrice;
    else videoPrice = price;

    return (
      <Fragment>
        {loading && <Loader
          custom
          classContainer="loaderContainer"
          classContent="content"
          image={heart}
          title="Thank you for your purchase!"
          description="We are processing your payment"
        />}
        {showPromoModal && <Modal
          title="Promo code instructions"
          text="Promo codes are valid only for the same month in which they were generated and they are utilizable only once. Promo codes are associated to your email address, therefore in order to use them, you will need to be logged in. When you are ready, type the promo code in the dedicated field and, in case of successful validation, the video will start playing automatically."
          onClick={() => { this.setState({ showPromoModal: false }); }}
        />}
        <div className={classNames('cardsContainer', { showPayment })}>
          <div className="videoContainer">
            <div className="videoPlayer">
              <img src={videoLabel} className="videoLabel" alt="Dash in Between Tarot Zodiac" />
              { showVideo ? (
                <YouTube
                  videoId={showPreview ? preview : linkToVideo}
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
                    onClick={() => { this.checkUserVideoAccess(showPreview); }}
                    onKeyPress={() => { this.setState({ videoOpen: true }); }}
                  >
                    <img src={playButton} alt="Dash in Between Tarot Zodiac" />
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
              <div className="title">
                {type === "PICKACARD" ? "CHECKOUT - Access to all 4 groups!" : "30 SECOND CHECKOUT" }
              </div>
              <div className="payPalWrapper">
                {
                  hasDiscount ? <div className="priceDiscounted">${sitePromo.newPrice.toFixed(2)}</div> : ""
                }
                <div className={classNames('price', { hasDiscount })}>
                $
                  {shownPrice}
                </div>
                <PayPalButton
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{ amount: { currency_code: 'USD', value: videoPrice } }],
                      application_context: { shipping_preference: 'NO_SHIPPING' },
                    })
                  }}

                  onApprove={async (_data, actions) => {
                    try {
                      this.setState({ loading: true });
                      const payment = await actions.order.capture();
                      this.processPayment(payment, queryVideoId, videoPrice, name, type, createOrder);
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
              <PromoCode
                checkUserVideoAccess={this.checkUserVideoAccess}
                giveUserAccess={this.giveUserAccess}
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
          <Labels 
            options={options}
            selected={optionSelected} 
            showPreview={showPreview}
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
            onClickOption={(optionSelected) => {
              this.setState({ optionSelected });
              this.checkUserVideoAccess();
            }}
          />
        </div>
      </Fragment>
    );
  }
}
