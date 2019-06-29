import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($email: String!, $ip: String!) {
    createUser(email: $email, ip: $ip) {
      id
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation loginMutation($token: String!) {
    login(token: $token) {
      token
      error
      user {
        id
        email
        # preferences for recommendation engine
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signupMutation($token: String!) {
    signup(token: $token) {
      token
      error
      user {
        id
        email
        # preferences for recommendation engine
      }
    }
  }
`;

export const PASSWORD_RESET_EMAIL_MUTATION = gql`
  mutation sendPasswordResetEmailMutation($email: String!) {
    sendPasswordResetEmail(email: $email) {
      error
    }
  }
`;

export const PASSWORD_UPDATE_MUTATION = gql`
  mutation passwordUpdateMutation($token: String!) {
    passwordUpdate(token: $token) {
      token
      error
      user {
        email
        # preferences for recommendation engine
      }
    }
  }
`;

const ADD_USER_IP_MUTATION = gql`
  mutation addUserIpMutation($email: String!, $ips: [String]!) {
    addUserIp(email: $email, ips: $ips) {
      id
    }
  }
`;

const USE_PROMO_CODE_MUTATION = gql`
  mutation UsePromoCodeMutation($code: String!, $videoId: String!, $videoType: String!, $token: String!) {
    usePromoCode(code: $code, videoId: $videoId, videoType: $videoType, token: $token) {
      error
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrderMutation(
    $userToken: String, 
    $ips: [String], 
    $videoId: String!, 
    $firstName: String, 
    $lastName: String,
    $paymentId: String!
    $type: String!
    $paymentEmail: String!
  ) {
    createOrder(
      userToken: $userToken, 
      ips: $ips, 
      videoId: $videoId, 
      firstName: $firstName, 
      lastName: $lastName,
      paymentId: $paymentId,
      type: $type,
      paymentEmail: $paymentEmail,
    ) {
      promo {
        code
      }
      user {
        id
      }
    }
  }
`;

export const UNSUBSCRIBE_USER_MUTATION = gql` #rename make more general because it's used for both unsub and sub
  mutation SubscribeUpdateMutation($email: String!, $type: String!, $subscribe: Boolean!) {
    subscribeUpdate(email: $email, type: $type, subscribe: $subscribe) {
      id
    }
  }
`;

export const loginMutation = ({ render, token }) => (
  <Mutation mutation={LOGIN_MUTATION} variables={{ token }}>
    {render}
  </Mutation>
);

export const signupMutation = ({ render, token }) => (
  <Mutation mutation={SIGNUP_MUTATION} variables={{ token }}>
    {render}
  </Mutation>
);

export const addUserIpMutation = ({ render }) => (
  <Mutation mutation={ADD_USER_IP_MUTATION}>
    {render}
  </Mutation>
);

export const createOrderMutation = ({ render }) => (
  <Mutation mutation={CREATE_ORDER_MUTATION}>
    {render}
  </Mutation>
);

export const createUserMutation = ({ render, ip, email }) => (
  <Mutation mutation={CREATE_USER_MUTATION} variables={{ ip, email }}>
    {render}
  </Mutation>
);

export const usePromoCodeMutation = ({
  render, code, videoId, email,
}) => (
  <Mutation mutation={USE_PROMO_CODE_MUTATION} variables={{ code, videoId, email }}>
    {render}
  </Mutation>
);
