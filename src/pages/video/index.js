import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import YouTube from 'react-youtube';

import './index.css';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import VideoNotFound from './components/video-not-found';
import playButton from '../../assets/images/play-button.png';
import { VIDEO_QUERY } from '../../operations/queries';
import { ADD_USER_IP_MUTATION } from '../../operations/mutations';

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: false,
    };
  }

  setUserVideoAccess({ users }, addUserIp) {
    const { userEmail, userIp } = this.props;
    const user = users.filter(({ email }) => email === userEmail)[0];
    if (user) {
      const hasIp = user.ips.includes(userIp);
      if (!hasIp) {
        const { ips } = user;
        addUserIp({ variables: { email: userEmail, ips: [...ips, userIp] } });
      }
    }
    this.setState({ hasAccess: !!user });
  }

  render() {
    const { videoId } = this.props;
    const { hasAccess } = this.state;

    return (
      <Mutation mutation={ADD_USER_IP_MUTATION}>
        {addUserIp => (
          <Query
            query={VIDEO_QUERY}
            variables={{ id: videoId }}
            onCompleted={data => this.setUserVideoAccess(data.videos[0], addUserIp)}
          >
            {({ data, loading, error }) => {
              if (loading) { return <Loader />; }
              if (error) { return <Error />; }
              if (!data.videos.length) { return <VideoNotFound />; }

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
        )}
      </Mutation>
    );
  }
}
