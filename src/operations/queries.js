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

export const USERIP_QUERY = gql` 
  query UserIpQuery {
    userIp
  }
`;

export const LATEST_VIDEOS_QUERY = gql` 
  query LatestVideosQuery($type: String!, $skipId: String, $familyId: String) {
    latestVideos(type: $type, skipId: $skipId, familyId: $familyId) {
      id
      title
      name
      image
      published
    }
  }
`;

export const getVideoQuery = ({ render, id }) => (
  <Query query={VIDEO_QUERY} variables={{ id }}>
    {render}
  </Query>
);

export const latestVideosQuery = ({ render, id }) => (
  <Query query={VIDEO_QUERY} variables={{ id }}>
    {({ data: { videos } }) => {
      const video = videos ? videos[0] : {};
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
