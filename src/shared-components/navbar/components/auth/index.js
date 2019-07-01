import React, { Component, Fragment } from 'react';
import { Mutation } from "react-apollo";
import { Adopt } from 'react-adopt';
import { toast as notification } from 'react-toastify';
import jwt from 'jsonwebtoken';
import classNames from 'classnames';

import Loader from '../../../loader';
import { 
  loginMutation,
  signupMutation,
  PASSWORD_UPDATE_MUTATION,
  PASSWORD_RESET_EMAIL_MUTATION,
} from '../../../../operations/mutations';
import { COOKIE_EMAIL, COOKIE_USER_TOKEN, COOKIE_USER_ID, COOKIE_PAYPAYL_EMAIL } from '../../../../constants';
import { getCookie, setCookie, addChangeListener, removeChangeListener } from '../../../../cookieUtils';
import { validateField } from '../../../../utils';

import './index.css';

// TODO REFACTOR ALL FILE
export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loginActive: true,
      resetPsw: false,
      recoverPsw: false,
      email: '',
      password: '',
      passwordConfirmation: '',
      urlToken: '',
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.afterCheckout) {
      const email = getCookie(COOKIE_PAYPAYL_EMAIL);
      return { email, loginActive: false }
    }
    return null
  }

  componentDidMount() {
    addChangeListener(this.cookieCheck);
  }

  cookieCheck = ({ name: cookieName, value: cookieValue }) => {
    if (cookieName === COOKIE_PAYPAYL_EMAIL) {
      this.setState({ email: cookieValue });
      removeChangeListener(this.cookieCheck);
    }
  }

  async authAttempt(isLogin, loginCb, signupCb) {
    const { state: { email, password }, props: { close } } = this;
    const isEmailValid = validateField('email', email);
    const isPasswordValid = validateField('password', password);
    if (!isEmailValid) return notification.error('Email address is invalid.') // TODO move all messages to constants
    if (!isPasswordValid) return notification.error('Password needs to be at least 6 characters long.')
  
    try {
      const userId = getCookie(COOKIE_USER_ID);
      const token = jwt.sign({ email, password, userId }, process.env.REACT_APP_JWT_SECRET); // TODO get from process
      const authType = isLogin ? 'login' : 'signup';
      const { data: { [authType]: { error, user, token: tokenServer } } } = isLogin ? 
        await loginCb({ variables: { token }}) : await signupCb({ variables: { token }});
      if (error) return notification.error(error);
      setCookie(COOKIE_USER_TOKEN, tokenServer);
      setCookie(COOKIE_USER_ID, user.id);
      notification('Welcome to DASH!');
      close();
    } catch(e) {
      notification.error('Ops! Something went wrong. Please try again later.');
    }
  }

  loginSignupSnippet() {
    const { 
      state: { loginActive, email, password }, 
      props: { afterCheckout, removeAfterCheckout } 
    } = this;
    const showLogin = loginActive && !afterCheckout;
    const type = showLogin ? 'Log in' : 'Sign up';
    return (
      <Adopt mapper={{ loginMutation, signupMutation }}>
        {({
          loginMutation: login,
          signupMutation: signup,
        }) => (
          <Fragment>
            <h1>{type}</h1>
            {afterCheckout && <p className="accessAgain shake">Watch once or sign up to watch again at any time.</p>}
            <div className="inputField">
              <p>Email Address</p>
              <input 
                type="email" 
                value={email}
                onChange={(e) => this.setState({ email: e.target.value.toLowerCase() })}
                onKeyPress={(e) => { if (e.key === "Enter") this.authAttempt(showLogin, login, signup) }}
              />
            </div>
            <div className="inputField">
              <p>Password</p>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { this.setState({ password: e.target.value.toLowerCase() }) }}
                onKeyPress={(e) => { if (e.key === "Enter") this.authAttempt(showLogin, login, signup) }}
              />
            </div>
            {showLogin && <a onClick={() => { this.setState({ recoverPsw: true }) }}>
              Forgot your password?
            </a>}
            <button
              onClick={async () => {
                this.setState({ loading: true });
                await this.authAttempt(showLogin, login, signup)  
                this.setState({ loading: false });
              }}
            >{type.toUpperCase()}</button>
            <div className="loginOrSignup">
              {showLogin && <Fragment>  
                <p>Don't have an account?</p>
                <p 
                  className="callToAction"
                  onClick={() => { this.setState({ loginActive: false }) }}
                >Sign up</p>
              </Fragment>}
              {!showLogin && <Fragment>  
                <p>Already have an account?</p>
                <p 
                  className="callToAction"
                  onClick={() => { 
                    this.setState({ loginActive: true }) 
                    if (afterCheckout) removeAfterCheckout();
                  }}
                >Log in</p>
              </Fragment>}
            </div>
          </Fragment>
        )}
      </Adopt>
    )
  }
  
  recoverPasswordSnippet() {
    const { email } = this.state;
    return (
      <Mutation mutation={PASSWORD_RESET_EMAIL_MUTATION}>
        {sendPasswordResetEmail => (
          <Fragment>
            <h1 className="recoveryTitle">Reset your password</h1>
            <div className="inputField">
              <p>Email Address</p>
              <input 
                type="email" 
                value={email}
                onChange={(e) => { this.setState({ email: e.target.value.toLowerCase() }) }}
                onKeyPress={async (e) => { 
                  // if (e.key === 'Enter' && process.env.NODE_ENV === 'production') {
                  if (e.key === 'Enter') {
                    const isEmailValid = validateField('email', email);
                    if (!isEmailValid) return notification.error('Email address is invalid.');
                    this.setState({ loading: true });
                    const { data: { sendPasswordResetEmail: { error } } } = await sendPasswordResetEmail({ variables: { email } });
                    this.setState({ loading: false });
                    if (error) return notification.error(error);
                    notification("Email reset sent!");
                    this.closeAuth(); 
                  }
                }}
              />
            </div>
            <p className="recoveryCopy">
              Enter the email address associated with your account and we'll email you a link to reset your password.
            </p>
            <button
              onClick={async () => { 
                if (process.env.NODE_ENV === 'production') {
                  const isEmailValid = validateField('email', email);
                  if (!isEmailValid) return notification.error('Email address is invalid.');
                  this.setState({ loading: true });
                  const { data: { sendPasswordResetEmail: { error } } } = await sendPasswordResetEmail({ variables: { email } });
                  this.setState({ loading: false });
                  if (error) return notification.error(error);
                  notification("Email reset sent!"); // TODO move to constants
                  this.closeAuth(); 
                }
              }}
            >SEND</button>
            <p 
              className="backLogin"
              onClick={() => { this.setState({ recoverPsw: false }) }}
            >Back to login</p>
          </Fragment>
        )}
      </Mutation>
    )
  }

  async attemptPasswordReset(passwordUpdate) {
    this.setState({ loading: true });
    const { state: { password, passwordConfirmation }, props: { urlToken } } = this;
    const { email } = jwt.verify(urlToken, process.env.REACT_APP_JWT_SECRET);
    const isPasswordValid = validateField('password', password);
    if (!isPasswordValid) {
      this.setState({ loading: false });
      return notification.error('Password needs to be at least 6 characters long.')
    } else if (password !== passwordConfirmation) {
      this.setState({ loading: false });
      return notification.error('Passwords don\'t match.');
    }
    const token = jwt.sign({ email, password }, process.env.REACT_APP_JWT_SECRET); // TODO get from process - move all to utils
    const { data: { passwordUpdate: { user, token: tokenServer } } } = await passwordUpdate({ variables: { token } });
    this.setState({ loading: false });
    setCookie(COOKIE_USER_TOKEN, tokenServer);
    setCookie(COOKIE_USER_ID, user.id);
    window.location.assign(`/?notification=Password Updated`)
  }

  resetPswSnippet() {
    return (
      <Mutation mutation={PASSWORD_UPDATE_MUTATION}>
        {passwordUpdateMutation => (
          <Fragment>
            <h1>Reset your password</h1>
            <div className="inputField">
              <p>Password</p>
              <input 
                type="password" 
                onChange={(e) => { this.setState({ password: e.target.value.toLowerCase() }) }}
                onKeyPress={(e) => { 
                  if (e.key === 'Enter') { this.attemptPasswordReset(passwordUpdateMutation); }
                }}
              />
            </div>
            <div className="inputField">
              <p>Confirm Password</p>
              <input 
                type="password" 
                onChange={(e) => { this.setState({ passwordConfirmation: e.target.value.toLowerCase() }) }}
                onKeyPress={(e) => { 
                  if (e.key === 'Enter') { this.attemptPasswordReset(passwordUpdateMutation); }
                }}
              />
            </div>
            <button
              onClick={() => { this.attemptPasswordReset(passwordUpdateMutation); }}
            >Update and Log in</button>
          </Fragment>
        )}
      </Mutation>
    )
  }

  closeAuth = () => {
    const { close, afterCheckout, removeAfterCheckout, resetPsw } = this.props;
    if (resetPsw) { return window.location.assign('/') }
    close();
    if (afterCheckout) removeAfterCheckout();
    this.setState({ loginActive: true, resetPsw: false, recoverPsw: false });
  }

  render() {
    const { state: { recoverPsw, loading }, props: { show, resetPsw, afterCheckout } } = this;
    return (
      <Fragment>
        <div 
          className={classNames('authContainer', { show })}
          onClick={() => {
            if (!afterCheckout) this.closeAuth();
            else if (window.confirm("If you don't sign up you won't be able to access the video again at a later time.")) {
              this.closeAuth();
            }
          }} 
        />
        <div className={classNames('authWrapper', { show })}>
          {loading && <Loader classContainer='authLoader' />}
          <div className="auth">
            <i 
              className="far fa-times-circle" 
              onClick={() => {
                if (!afterCheckout) this.closeAuth();
                else if (window.confirm("If you don't sign up you won't be able to access the video again at a later time.")) {
                  this.closeAuth();
                }
              }} 
            />
            {!resetPsw && !recoverPsw && this.loginSignupSnippet()}
            {recoverPsw && !resetPsw && this.recoverPasswordSnippet()}
            {resetPsw && this.resetPswSnippet()}
          </div>
        </div>
      </Fragment>
    )
  }
}