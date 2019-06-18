import React, { Component } from 'react';

import megaphone from '../../../../assets/images/megaphone.png';
import line from '../../../../assets/images/line.png';
import './index.css';

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
      const hours = (`0${Math.floor((distance / (1000 * 60 * 60)))}`).slice(-2);
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
      }, props: { promo: { promoOffer, title, subtitle, description } },
    } = this;

    const body = document.querySelector('body');
    body.style.overflow = open ? 'hidden' : 'initial';
    body.style.position = open ? 'fixed' : 'initial';
    
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
          <p className="title">{title}</p>
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
          <p className="subtitle">{subtitle}</p>
          <p className="description">{description}</p>
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
