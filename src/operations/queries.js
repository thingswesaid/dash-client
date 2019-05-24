import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

export const VIDEO_PAGE_QUERY = gql` 
  query VideoPageQuery($id: ID!, $ip: String, $email: String, $showAll: Boolean) {
    videoPage(id: $id, ip: $ip, email: $email, showAll: $showAll) {
      video {
        id
        name
        link
        preview
        image
        placeholder
        published
        amount
        start
        type
        familyId
        users {
          id
          email
          ips
          active
        }
      }
      latestVideos {
        id
        title
        name
        image
        placeholder
        published
      } 
      promoVideo {
        link
        title
        description
        image
        placeholder
        banner
        bannerMobile
      }
      userActive
    }
  }
`;

export const SEARCH_QUERY = gql` 
  query SearchQuery($keywords: String!) {
    videos(keywords: $keywords) {
      id
      link
      image
      title
      placeholder
    }
  }
`;

export const USERIP_QUERY = gql` 
  query UserIpQuery {
    userIp
  }
`;

export const PRODUCT_QUERY = gql` 
  query ProductsQuery($type: String) {
    products(type: $type) {
      types
      items {
        link
        name
        description
        image
        placeholder
        type
      }
    }
  }
`;

export const videoPageQuery = ({
  render, id, ip, email, showAll,
}) => (
  <Query
    query={VIDEO_PAGE_QUERY}
    variables={{
      id, ip, email, showAll,
    }}
  >
    {render}
  </Query>
);

export const searchQuery = ({ render, keywords = '' }) => (
  <Query query={SEARCH_QUERY} variables={{ keywords }}>
    {render}
  </Query>
);

export const productsQuery = ({ render, type }) => (
  <Query query={PRODUCT_QUERY} variables={{ type }}>
    {render}
  </Query>
);
