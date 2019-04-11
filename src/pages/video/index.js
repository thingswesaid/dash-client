import React, { Component, Fragment } from 'react' 
import { Query } from 'react-apollo'
import  { gql } from 'apollo-boost'
import YouTube from 'react-youtube'

export default class Video extends Component {
  render() {
    // console.log("PROPS > ", this.props.match.params.id)

    console.log("YouTube > ", YouTube)
    const opts = {
      height: '390',
      width: '640',
      playerVars: { 
        autoplay: 1
      }
    };

    return (
      <Query query={FEED_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>Loading ...</div>
              </div>
            )
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>An unexpected error occured.</div>
              </div>
            )
          }

          return (
            <Fragment>
                VIDEO SECTION

                <YouTube videoId={"ZIchuVxBVng"} opts={opts} />

            </Fragment>
          )
        }}
      </Query>
    )
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
`
