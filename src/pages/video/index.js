import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import YouTube from 'react-youtube';

import './index.css';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import NotFound from './components/not-found';
import playButton from '../../assets/images/play-button.png';
import { VIDEO_QUERY } from '../../operations/queries';

// will call when user purchases video and doesn't exist yet
const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($email: String!, $ip: String!) {
    createUser(email: $email, ip: $ip) {
      id
    }
  }
`;

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: false,
    };
  }

  setUserVideoAccess({ users }) {
    const { userEmail, userIp } = this.props;
    const user = users.filter(({ email }) => email === userEmail)[0];
    if (user) {
      const hasIp = user.ips.includes(userIp);
      // if !hasIp add new IP to DB
    }
    this.setState({ hasAccess: !!user });
  }

  render() {
    const { videoId } = this.props;
    const { hasAccess } = this.state;
    console.log('hasAccess', hasAccess);
    return (
      <Query
        query={VIDEO_QUERY}
        variables={{ id: videoId }}
        onCompleted={data => this.setUserVideoAccess(data.videos[0])}
      >
        {({ data, loading, error }) => {
          if (loading) { return <Loader />; }
          if (error) { return <Error />; }
          if (!data.videos.length) { return <NotFound />; }

          const { image, link } = data.videos[0];
          return (
            <Fragment>
              <div className="videoPlayer">
                <img src={playButton} className="playButton" alt="play button" />
                <img src={image} className="videoPlaceholder" alt="placeholder" />
                <YouTube videoId={link} />
              </div>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}
