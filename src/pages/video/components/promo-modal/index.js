import React, { Component } from 'react';
import './index.css';

import megaphone from '../../../../assets/images/megaphone.png';
import line from '../../../../assets/images/line.png';

export default class MainVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      hours: 23,
      minutes: 59,
      seconds: 59,
    };
  }

  componentDidMount() {
    const countDownDate = new Date('Jun 1, 2019 23:59:59').getTime();
    const countDown = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = (`0${Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`).slice(-2);
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
      hours, minutes, seconds, open,
    } = this.state;
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
              document.cookie = 'BUY1GET1=true;  expires=Sun, 02 Jun 2019 00:00:00 GMT';
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
        With the purchase of one video you will automatically receive a promo code on your email address which can be used to access an additional extended video.
        The promo code doesn’t expire and can be used on monthly zodiac readings.
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
