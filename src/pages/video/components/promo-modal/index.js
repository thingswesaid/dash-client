import React, { Component } from 'react';
import './index.css';

import megaphone from '../../../../assets/images/megaphone.png';
import line from '../../../../assets/images/line.png';

export default class PromoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      hours: '--',
      minutes: '--',
      seconds: '--',
    };
  }

  componentDidMount() {
    const { promo: { endDate } } = this.props;
    const countDownDate = new Date(endDate).getTime();
    const countDown = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const hours = Math.floor((distance / (1000 * 60 * 60)));
      const minutes = (`0${Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}`).slice(-2);
      const seconds = (`0${Math.floor((distance % (1000 * 60)) / 1000)}`).slice(-2);
      this.setState({ hours, minutes, seconds });
      if (distance < 0) {
        clearInterval(countDown);
      }
    }, 1000);
  }

  render() {
    const {
      state: {
        hours, minutes, seconds, open,
      }, props: { videoType, promo: { promoOffer } },
    } = this;

    const body = document.querySelector('body');
    body.style.overflow = open ? 'hidden' : 'initial';
    return open ? (
      <div className="promoModalContainer">
        <div className="promoModal">
          <img src={megaphone} className="megaphone" alt="promo" />
          <img src={line} className="line" alt="promo" />
          <i
            className="fa fa-times close"
            aria-hidden="true"
            onClick={() => {
              this.setState({ open: false });
              const date = new Date();
              date.setHours(date.getHours() + 24);
              document.cookie = `${promoOffer}=true;expires=${date}`;
            }}
          />
          <p className="title">FREE VIDEO!</p>
          <div className="expires">
            <p>
            expires in
            </p>
            <p className="countDown">
              {hours}
              :
              {minutes}
              :
              {seconds}
            </p>
          </div>
          <p className="subtitle">Buy 1 get 1 free immediately</p>
          <p className="description">
            With the purchase of one
            {' '}
            {videoType.toLowerCase()}
            {' '}
            video you will automatically receive a promo code on your email address
            which can be used to access an additional extended video. This promo code
            is valid for the current month and can be used on
            {' '}
            {videoType.toLowerCase()}
            {' '}
            readings only.
          </p>
          <div className="socials">
            <a href="https://www.instagram.com/dash.inbetween/?hl=en" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram" />
            </a>
            <a href="https://www.youtube.com/channel/UCXijIQQdb6XX8zhPJWAxPHQ/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube" />
            </a>
          </div>
        </div>
      </div>
    ) : '';
  }
}
