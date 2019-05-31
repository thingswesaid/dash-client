/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component, Fragment } from 'react';
import { Adopt } from 'react-adopt';
import { toast as addNotification } from 'react-toastify';

import Modal from '../../../../shared-components/modal';
import emailExampleGif from '../../../../assets/images/email-example.gif';
import { getCookie } from '../../../../utils';
import { usePromoCodeMutation } from '../../../../operations/mutations';
import { promoCodeQuery } from '../../../../operations/queries';
import {
  EMAIL_NOT_VALID,
  EMAIL_NOT_FOUND,
  COOKIE_EMAIL,
  COOKIE_RECENT_ORDER,
  EMAIL_REGEX,
} from '../../../../constants';
import './index.css';

export default class CallToAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      promoCode: '',
      email: '',
      emailFromPromo: '',
      showPromo: false,
      showEmail: false,
      showPromoModal: false,
      showEmailModal: false,
      showEmailForPromo: false,
    };
  }

  toggleBottomSection(type) {
    switch (type) {
      case 'email':
        this.setState({
          showEmail: true,
          showPromo: false,
        });
        break;
      case 'promo':
        this.setState({
          showEmail: false,
          showPromo: true,
        });
        break;
      default:
        this.setState({
          showEmail: false,
          showPromo: false,
        });
    }
  }

  findEmailForVideo() {
    const { checkUserVideoAccess, emailField } = this.props;
    const cookieEmail = getCookie(COOKIE_EMAIL);
    const valid = EMAIL_REGEX.test(String(emailField).toLowerCase());
    if (!valid) {
      return addNotification.info(
        EMAIL_NOT_VALID,
        { className: 'notification notificationError' },
      );
    }

    const user = checkUserVideoAccess();
    if (!user) {
      return addNotification(
        EMAIL_NOT_FOUND,
        { className: 'notification' },
      );
    }
    if (cookieEmail !== emailField) {
      document.cookie = `${COOKIE_EMAIL}=${emailField};`;
    }
    return undefined;
  }

  async validatePromoCode(getPromoCode, usePromoCode) {
    const { state: { promoCode }, props: { videoId, giveUserAccess } } = this;
    if (!promoCode.length) { return; }
    await this.setState({ loading: true });
    const { data: { promoCode: promo } } = await getPromoCode({ code: promoCode });
    await this.setState({ loading: false });
    if (!promo) {
      addNotification.error(
        'Promo code does not exist',
        { className: 'notification notificationError' },
      );
      return;
    }

    const { valid, user: { email } } = promo;
    if (!valid) {
      addNotification.error(
        'Promo code has already been used',
        { className: 'notification notificationError' },
      );
      return;
    }

    const cookieEmail = getCookie(COOKIE_EMAIL);
    if (cookieEmail !== email) {
      this.setState({ emailFromPromo: email, showEmailForPromo: true });
      return;
    }

    document.cookie = `${COOKIE_RECENT_ORDER}=true`;
    usePromoCode({ variables: { code: promoCode, videoId, email: cookieEmail } });
    giveUserAccess();
  }

  async handleEmailForPromo(usePromoCode) {
    const {
      state: { emailFromPromo, email, promoCode },
      props: { giveUserAccess, videoId },
    } = this;
    if (!email.length) { return; }
    if (email !== emailFromPromo) {
      this.setState({ showEmailForPromo: false });
      addNotification(
        'Promo code not associated to this email address',
        { className: 'notification' },
      );
    } else {
      await this.setState({ loading: true });
      usePromoCode({ variables: { code: promoCode, videoId, email } });
      document.cookie = `${COOKIE_EMAIL}=${email.toLowerCase()};`;
      document.cookie = `${COOKIE_RECENT_ORDER}=true`;
      await this.setState({ loading: false });
      giveUserAccess();
    }
  }

  render() {
    const {
      state: {
        loading, showEmailForPromo, showPromoModal, showEmailModal, showEmail, showPromo,
      },
      props: { emailFieldUpdate },
    } = this;
    return (
      <Fragment>
        <Adopt mapper={{ usePromoCodeMutation, promoCodeQuery }}>
          {({
            usePromoCodeMutation: usePromoCode,
            promoCodeQuery: { refetch: getPromoCode },
          }) => (
            <div className="callToAction">
              {loading ? <div className="loading animationLoader" /> : ''}
              { showEmailModal || showPromoModal
                ? (
                  <Modal
                    title={showEmailModal
                      ? 'I already purchased this video, how can I watch it again?'
                      : 'Promo code instructions'
              }
                    text={showEmailModal
                      ? 'If you previously purchased this extended video, make sure to type the email address you used at checkout and we will be able to grant you access right away. You have unlimited access from any device.'
                      : 'Promo codes do not expire and they are usable only once. Promo codes are associated to your email address, if there is not a match, we will prompt you with an email address request. When you are ready, type the promo code in the dedicated field and, in case of successful validation, the video will start playing automatically.'
              }
                    image={showEmailModal ? emailExampleGif : ''}
                    onClick={() => { this.setState({ showEmailModal: false, showPromoModal: false }); }}
                  />
                ) : ''}
              { showEmailForPromo ? (
                <div className="emailForPromoContainer">
                  <div className="emailForPromo">
                    <i
                      className="far fa-times-circle"
                      onClick={() => { this.setState({ showEmailForPromo: false }); }}
                      onKeyPress={() => { this.setState({ showEmailForPromo: false }); }}
                      role="button"
                      tabIndex={0}
                    />
                    <p>Enter the email address on which you received the promo code</p>
                    <div className="inputEmail">
                      <input
                        placeholder="Enter Your Email Address"
                        onChange={(event) => {
                          const value = event.target.value.toLowerCase();
                          const email = value.replace(/\s/g, '');
                          this.setState({ email });
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { this.handleEmailForPromo(usePromoCode); } }}
                      />
                      <button type="submit" onClick={() => this.handleEmailForPromo(usePromoCode)}>GO</button>
                    </div>
                  </div>
                </div>
              ) : ''}
              {!showPromo && !showEmail ? (
                <div className="bottomItemSection">
                  <button
                    onKeyDown={() => { this.setState({ showPromo: true }); }}
                    onClick={() => { this.setState({ showPromo: true }); }}
                    type="button"
                  >
              PROMO CODE
                  </button>
                  <button
                    onKeyDown={() => { this.setState({ showPromo: true }); }}
                    onClick={() => { this.setState({ showEmail: true }); }}
                    type="button"
                  >
              ALREADY PURCHASED
                  </button>
                </div>
              ) : ''}
              {showPromo
                ? (
                  <div className="bottomFieldSection">
                    <div className="title">
                      <i
                        className="fas fa-chevron-circle-left"
                        onClick={() => this.toggleBottomSection()}
                        onKeyDown={() => this.toggleBottomSection()}
                        role="button"
                        tabIndex={0}
                      />
                      <p>Promotional Code</p>
                      <i
                        className="fas fa-info-circle"
                        onClick={() => { this.setState({ showPromoModal: true }); }}
                        onKeyDown={() => { this.setState({ showPromoModal: true }); }}
                        role="button"
                        tabIndex={0}
                      />
                    </div>
                    <div className="inputField">
                      <input
                        placeholder="Enter Promo Code"
                        onChange={(event) => {
                          const value = event.target.value.toLowerCase();
                          const promoCode = value.replace(/\s/g, '');
                          this.setState({ promoCode });
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { this.validatePromoCode(getPromoCode, usePromoCode); } }}
                      />
                      <button type="submit" onClick={() => this.validatePromoCode(getPromoCode, usePromoCode)}>GO</button>
                    </div>
                  </div>
                ) : ''}
              { showEmail ? (
                <div className="bottomFieldSection">
                  <div className="title">
                    <i
                      className="fas fa-chevron-circle-left"
                      onClick={() => this.toggleBottomSection()}
                      onKeyDown={() => this.toggleBottomSection()}
                      role="button"
                      tabIndex={0}
                    />
                    <p>Already purchased?</p>
                    <i
                      className="fas fa-info-circle"
                      onClick={() => { this.setState({ showEmailModal: true }); }}
                      onKeyDown={() => { this.setState({ showEmailModal: true }); }}
                      role="button"
                      tabIndex={0}
                    />
                  </div>
                  <div className="inputField">
                    <input
                      placeholder="Enter Your Email Address"
                      onChange={(event) => {
                        const value = event.target.value.toLowerCase();
                        emailFieldUpdate(value);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { this.findEmailForVideo(); } }}
                    />
                    <button type="submit" onClick={() => { this.findEmailForVideo(); }}>GO</button>
                  </div>
                </div>
              ) : ''}
            </div>
          )}
        </Adopt>
      </Fragment>
    );
  }
}
