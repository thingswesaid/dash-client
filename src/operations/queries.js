import { gql } from 'apollo-boost';

export const VIDEO_QUERY = gql` 
  query VideoQuery($id: ID!) {
    videos(id: $id) {
      id
      link
      preview
      image
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
