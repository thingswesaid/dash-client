import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

export const VIDEO_PAGE_QUERY = gql` 
  query VideoPageQuery($id: ID!, $ip: String, $userId: String, $showAll: Boolean) {
    videoPage(id: $id, ip: $ip, userId: $userId, showAll: $showAll) {
      video {
        id
        link
        preview
        image
        placeholder
        price
        start
        type
        familyId
        options
        keywords
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
        image
        placeholder
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
      user {
        id
        active
        videos {
          id
        }
      }
      sitePromo {
        promoOffer
        type
        title
        subtitle
        description
        newPrice
        startDate
        endDate
      }
    }
  }
`;

export const SEARCH_QUERY = gql` 
  query SearchQuery($keywords: String, $id: ID, $type: String) {
    videos(keywords: $keywords, id: $id, type: $type) {
      id
      link
      image
      title
      placeholder
      # maybe description for pick a card readings
    }
  }
`;

export const USER_QUERY = gql` 
  query userQuery($id: ID, $email: String) {
    userPage(id: $id, email: $email) {
      user {
        email
        role
        active
        subscribePromo
        subscribeEarlyAccess
        subscribeNews
        password
        ips
        promoCodes {
          code
          valid
          endDate
          createdAt
        }
        orders {
          createdAt
          video {
            id
            keywords
            imageVertical
            placeholderVertical
          }
        }
        videos {
          id
          imageVertical
          placeholderVertical
        }
      }
      quotes {
        text
        linkTo
      }
    }
  }
`;

export const USERIP_QUERY = gql` 
  query UserIpQuery {
    userIp { 
      ip
      location
    }
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

const PROMO_CODE_QUERY = gql` 
  query PromoCodeQuery($code: String) {
    promoCode(code: $code) {
      id
      code
      valid
      endDate
      type
      user {
        email
      }
    }
  }
`;

// TODO change name
export const STUDIO_PAGE_QUERY = gql` 
  query OrdersAnalytics($userId: String!, $from: String, $to: String) {
    ordersAnalytics(userId: $userId, from: $from, to: $to) {
      error
      list 
      count
      totalAmount
    }
  }
`;

export const PROMOS_HISTORY_QUERY = gql` 
  query ScheduledPromos {
    scheduledPromos {
      promo {
        promoOffer
        startDate
        endDate
        type
      }
      hasVideos
    }
  }
`;

export const SCHEDULED_VIDEOS_QUERY = gql` 
  query ScheduledVideos {
    scheduledVideos
  }
`;

export const videoPageQuery = ({
  render, id, ip, userId, showAll,
}) => (
  <Query
    query={VIDEO_PAGE_QUERY}
    variables={{
      id, ip, userId, showAll,
    }}
  >
    {render}
  </Query>
);

export const userPageQuery = ({ render, id = '', email = '' }) => (
  <Query query={USER_QUERY} variables={{ id, email }}>
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

export const promoCodeQuery = ({ render, code }) => (
  <Query query={PROMO_CODE_QUERY} variables={{ code }}>
    {render}
  </Query>
);
