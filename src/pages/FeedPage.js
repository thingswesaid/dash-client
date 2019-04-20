import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Post from './Post';

import { CREATE_ANONYMOUS_IP_MUTATION, CREATE_USER_MUTATION } from '../operations/mutations';


const tempComp = () => (
  <Mutation mutation={CREATE_USER_MUTATION}>
    {createUser => (
      <div
        onClick={async () => {
          await createUser(
            { variables: { email: 'manuel@aol.com', ip: '12304129' } },
          );
        }}
      >
CLICK THIS

      </div>
    )}
  </Mutation>
);

export default class FeedPage extends Component {
  render() {
    return (
      <Fragment>
        {tempComp()}
        <Query query={FEED_QUERY}>
          {({
            data, loading, error, refetch,
          }) => {
            if (loading) {
              return (
                <div className="flex w-100 h-100 items-center justify-center pt7">
                  <div>Loading ...</div>
                </div>
              );
            }

            if (error) {
              return (
                <div className="flex w-100 h-100 items-center justify-center pt7">
                  <div>An unexpected error occured.</div>
                </div>
              );
            }

            return (
              <Fragment>
                <h1>Feed</h1>
                {data.feed
                && data.feed.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    refresh={() => refetch()}
                    isDraft={!post.published}
                  />
                ))}
                {this.props.children}
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      content
      title
      published
    }
  }
`;
