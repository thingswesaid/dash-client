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

const ADD_USER_IP_MUTATION = gql`
  mutation addUserIpMutation($email: String!, $ips: [String]!) {
    addUserIp(email: $email, ips: $ips) {
      id
    }
  }
`;

const USE_PROMO_CODE_MUTATION = gql`
  mutation UsePromoCodeMutation($code: String!, $videoId: String!, $email: String!) {
    usePromoCode(code: $code, videoId: $videoId, email: $email) {
      valid
      user {
        email
      }
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrderMutation(
    $email: String!, 
    $ips: [String], 
    $videoId: String!, 
    $phone: String, 
    $firstName: String, 
    $lastName: String,
    $paymentId: String!
    $type: String!
  ) {
    createOrder(
      email: $email, 
      ips: $ips, 
      videoId: $videoId, 
      phone: $phone, 
      firstName: $firstName, 
      lastName: $lastName,
      paymentId: $paymentId,
      type: $type,
    ) {
      code
    }
  }
`;

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
