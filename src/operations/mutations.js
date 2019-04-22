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

export const CREATE_ANONYMOUS_IP_MUTATION = gql`
  mutation createAnonymousIpMutation($ip: String!) {
    createAnonymousIp(ip: $ip) {
      ip
    }
  }
`;

const ADD_USER_TO_VIDEO_MUTATION = gql`
  mutation addUserToVideoMutation(
    $email: String!, 
    $ips: [String], 
    $videoId: String!, 
    $phone: String, 
    $firstName: String, 
    $lastName: String,
    $paymentId: String!
  ) {
    addUserToVideo(
      email: $email, 
      ips: $ips, 
      videoId: $videoId, 
      phone: $phone, 
      firstName: $firstName, 
      lastName: $lastName,
      paymentId: $paymentId,
    ) {
      id
    }
  }
`;

export const addUserIpMutation = ({ render }) => (
  <Mutation mutation={ADD_USER_IP_MUTATION}>
    {render}
  </Mutation>
);

export const addUserToVideoMutation = ({ render }) => (
  <Mutation mutation={ADD_USER_TO_VIDEO_MUTATION}>
    {render}
  </Mutation>
);

export const createUserMutation = ({ render, ip, email }) => (
  <Mutation mutation={CREATE_USER_MUTATION} variables={{ ip, email }}>
    {render}
  </Mutation>
);

export const createAnonymousIpMutation = ({ render, ip }) => (
  <Mutation mutation={CREATE_ANONYMOUS_IP_MUTATION} variables={{ ip }}>
    {render}
  </Mutation>
);
