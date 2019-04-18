import { gql } from 'apollo-boost';

export const VIDEO_QUERY = gql` 
  query VideoQuery($id: ID!) {
    videos(id: $id) {
      id
      name
      link
      preview
      image
      published
      amount
      users {
        id
        email
        ips
        status
      }
    }
  }
`;

export const USERIP_QUERY = gql` 
  query UserIpQuery {
    userIp
  }
`;
