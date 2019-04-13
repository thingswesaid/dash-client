import React, { Component, Fragment } from 'react' 
import { Query } from 'react-apollo'
import  { gql } from 'apollo-boost'
import YouTube from 'react-youtube'
import './index.css'

export default class Video extends Component {
  render() {
    // this.props.match.params.id
    return (
      <Query query={VIDEO_QUERY} variables={{ id: "5" }}>
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

          console.log("DATA >>>>> ", data)

          return (
            <Fragment>
              <div className="videoPlayer">
                <img src="https://res.cloudinary.com/dw4v960db/image/upload/v1555027202/Aries_Secret_April.jpg" /> /* has to come from API */                <YouTube  videoId={"ZIchuVxBVng"} />
              </div>
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export const VIDEO_QUERY = gql`
  query VideoQuery($id: String!) {
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
