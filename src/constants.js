/* eslint-disable no-useless-escape */
export const EMAIL_REGEX = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s+)?$/;
export const EMAIL_NOT_VALID = 'Email format not valid.';
export const EMAIL_NOT_FOUND = 'Email not found. Select your payment method from the list.';
export const ACCOUNT_SUSPENDED = 'Account suspended.';
export const PAYMENT_ERROR = 'There was an error with the payment. Please try again later.';
export const COOKIE_EMAIL = 'dash-user-email';
export const COOKIE_RECENT_ORDER = 'dash-recent-order';
