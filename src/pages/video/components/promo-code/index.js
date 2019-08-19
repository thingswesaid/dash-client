/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component, Fragment } from 'react';
import { Adopt } from 'react-adopt';
import { toast as notification } from 'react-toastify';

import Modal from '../../../../shared-components/modal';
import { getCookie, setCookie } from '../../../../cookieUtils';
import { usePromoCodeMutation } from '../../../../operations/mutations';
import { promoCodeQuery } from '../../../../operations/queries';
import {
  COOKIE_USER_TOKEN,
  COOKIE_RECENT_ORDER,
} from '../../../../constants';
import './index.css';

export default class PromoCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      promoCodeField: '',
      showPromoModal: false,
    };
  }

  async validatePromoCode(usePromoCode) {
    const { state: { promoCodeField: promoCode }, props: { videoId, videoType, giveUserAccess } } = this;
    if (!promoCode.length) { return; }
    
    const userToken = getCookie(COOKIE_USER_TOKEN);
    if (!userToken) return notification.error("You need to be logged in to use your promo code.");
    await this.setState({ loading: true });
    const { data: { usePromoCode: { code, error } } } = await usePromoCode(
      { variables: { code: promoCode, videoType, videoId, token: userToken } }
    );
    await this.setState({ loading: false });
    if (error) return notification.error(error);
    
    setCookie(COOKIE_RECENT_ORDER, true);
    giveUserAccess();
  }

  render() {
    const { loading, showPromoModal } = this.state;
    return (
      <Fragment>
        <Adopt mapper={{ usePromoCodeMutation, promoCodeQuery }}>
          {({ usePromoCodeMutation: usePromoCode }) => (
            <div className="promoCode">
              {loading && <div className="loading animationLoader" />}
              {showPromoModal && <Modal
                title="Promo code instructions"
                text={`Promo codes are valid only for the same month in which they were generated and they are utilizable 
                only once. Promo codes are associated to your email address, if there is not a match, we will prompt you with 
                an email address request. When you are ready, type the promo code in the dedicated field and, in case of 
                successful validation, the video will start playing automatically.`}
                onClick={() => { this.setState({ showPromoModal: false }); }}
              />}
              <div className="bottomFieldSection">
                <div className="title">
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
                      const promoCodeField = value.replace(/\s/g, '');
                      this.setState({ promoCodeField });
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { this.validatePromoCode(usePromoCode); } }}
                  />
                  <button type="submit" onClick={() => this.validatePromoCode(usePromoCode)}>GO</button>
                </div>
              </div>
            </div>
          )}
        </Adopt>
      </Fragment>
    );
  }
}
