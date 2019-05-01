import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

export const VIDEO_QUERY = gql` 
  query VideoQuery($id: ID) {
    videos(id: $id) {
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
        status
      }
    }
  }
`;

export const SEARCH_QUERY = gql` 
  query VideoQuery($keywords: String!) {
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

export const LATEST_VIDEOS_QUERY = gql` 
  query LatestVideosQuery($type: String, $skipId: String, $familyId: String) {
    latestVideos(type: $type, skipId: $skipId, familyId: $familyId) {
      id
      title
      name
      image
      placeholder
      published
    }
  }
`;

export const PROMO_VIDEOS_QUERY = gql` 
  query PromoVideosQuery($familyId: String) {
    promoVideos(familyId: $familyId) {
      link
      title
      description
      image
      placeholder
      banner
      bannerSmall
    }
  }
`;

export const PRODUCT_QUERY = gql` 
  query ProductsQuery($type: String) {
    products(type: $type) {
      link
      name
      description
      image
      placeholder
      type
    }
  }
`;

export const productsQuery = ({ render, type }) => (
  <Query query={PRODUCT_QUERY} variables={{ type }}>
    {render}
  </Query>
);

export const getVideoQuery = ({ render, id }) => (
  <Query query={VIDEO_QUERY} variables={{ id }}>
    {render}
  </Query>
);

export const latestVideosQuery = ({ render, id }) => (
  <Query query={VIDEO_QUERY} variables={{ id }}>
    {({ data: { videos } }) => {
      const video = videos ? videos[0] : {};
      if (!video) { return render(); }
      const { id: videoId, type, familyId } = video;
      const hasVideo = Object.keys(video).length;
      return hasVideo ? (
        <Query
          query={LATEST_VIDEOS_QUERY}
          variables={{ type, familyId, skipId: videoId }}
        >
          {render}
        </Query>
      ) : '';
    }}
  </Query>
);

export const promoVideosQuery = ({ render, id }) => (
  <Query query={VIDEO_QUERY} variables={{ id }}>
    {({ data: { videos } }) => {
      const video = videos ? videos[0] : {};
      if (!video) { return render(); }
      const { familyId } = video;
      const hasVideo = Object.keys(video).length;
      return hasVideo ? (
        <Query
          query={PROMO_VIDEOS_QUERY}
          variables={{ familyId }}
        >
          {render}
        </Query>
      ) : '';
    }}
  </Query>
);
