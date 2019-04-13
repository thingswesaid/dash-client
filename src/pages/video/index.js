import React, { Component, Fragment } from 'react' 
import { Query } from 'react-apollo'
import  { gql } from 'apollo-boost'
import YouTube from 'react-youtube'
import './index.css'

import playButton from '../../assets/images/play-button.png'

export default class Video extends Component {
  // add state for playing to hide the image placeholder
  render() {
    // this.props.match.params.id
    return (
      <Query query={VIDEO_QUERY} variables={{id: "5"}}>
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

          // if !data show mosaic with all other videos - VIDEO NOT FOUND in the middle
          const { image, link } = data.videos[0];

          return (
            <Fragment>
              <div className="videoPlayer">
                <img src={playButton} className="playButton" />
                <img src={image} /> 
                <YouTube videoId={link} />
              </div>
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export const VIDEO_QUERY = gql`
  query VideoQuery($id: ID!) {
    videos(id: $id) {
      id
      link
      preview
      image
      users {
        id
      }
    }
  }
`
