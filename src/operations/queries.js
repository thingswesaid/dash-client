import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

const VIDEO_QUERY = gql` 
  query VideoQuery($id: ID!) {
    videos(id: $id) {
      id
      name
      link
      preview
      image
      published
      amount
      start
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

export const getVideoQuery = ({ render, id, videoComponent }) => (
  // eslint-disable-next-line react/no-this-in-sfc
  <Query
    query={VIDEO_QUERY}
    variables={{ id }}
    onCompleted={(data) => {
      if (data.videos[0]) {
        videoComponent.setState({ amount: data.videos[0].amount });
      }
    }
    }
  >
    {render}
  </Query>
);
