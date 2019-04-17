import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import YouTube from 'react-youtube';
import StripeCheckout from 'react-stripe-checkout';

import './index.css';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';
import VideoNotFound from './components/video-not-found';
import playButton from '../../assets/images/play-button.png';
import { VIDEO_QUERY } from '../../operations/queries';
import { ADD_USER_IP_MUTATION } from '../../operations/mutations';

import labelExtended from '../../assets/images/label-extended.png';
import labelPreview from '../../assets/images/label-preview.png';

// TODO break in smaller components
export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: false,
      videoOpen: false,
      showPreview: false,
    };
  }

  setUserVideoAccess(users, addUserIp, playVideo) {
    const { userEmail, userIp } = this.props;
    const user = users.filter(({ email }) => email === userEmail)[0];
    if (user) {
      const hasIp = user.ips.includes(userIp);
      if (!hasIp) {
        const { ips } = user;
        addUserIp({ variables: { email: userEmail, ips: [...ips, userIp] } });
      }
    }
    // if doesn't have access open payment component - buzzz
    // start video from extended
    this.setState({ hasAccess: !!user, videoOpen: !!user && playVideo });
  }

  foobar(stuff) {
    console.log('IN FOOBAR', stuff);
  }

  render() {
    const { videoId } = this.props;
    const { videoOpen, showPreview } = this.state;
    const videoLabel = showPreview ? labelPreview : labelExtended;
    return (
      <Mutation mutation={ADD_USER_IP_MUTATION}>
        {addUserIp => (
          <Query
            query={VIDEO_QUERY}
            variables={{ id: videoId }}
            onCompleted={data => this.setUserVideoAccess(data.videos[0].users, addUserIp, false)}
          >
            {({ data, loading, error }) => {
              console.log('VIDEO > ', data);
              if (loading) { return <Loader />; }
              if (error) { return <Error />; } /* log to sumo or similar */
              if (!data.videos.length) { return <VideoNotFound />; }

              const {
                image, link, preview, users, amount, published,
              } = data.videos[0];

              if (!published) { return <VideoNotFound />; }

              return (
                <Fragment>
                  <div className="videoMain">
                    <div className="suggestion" />
                    <div className="videoContainer">
                      <div className="videoPlayer shadow">
                        <img src={videoLabel} className="videoLabel" alt="video label" />
                        { videoOpen ? (
                          <YouTube
                            videoId={showPreview ? preview : link}
                            opts={{
                              playerVars: {
                                autoplay: 1,
                              },
                            }}
                          />
                        ) : (
                          <Fragment>
                            <button
                              type="button"
                              className="playButton"
                              onClick={() => { this.setUserVideoAccess(users, addUserIp, true); }}
                              onKeyPress={() => { this.setState({ videoOpen: true }); }}
                            >
                              <img src={playButton} alt="play button" />
                            </button>
                            <img src={image} className="videoPlaceholder" alt="placeholder" />
                          </Fragment>
                        )}
                      </div>
                      <button
                        type="button"
                        className="showLabel"
                        onClick={() => {
                          if (showPreview) {
                            this.setUserVideoAccess(users, addUserIp, true);
                            this.setState({ showPreview: !showPreview });
                          } else {
                            this.setState({ showPreview: !showPreview, videoOpen: !showPreview });
                          }
                        }}
                        onKeyPress={() => {
                          if (showPreview) {
                            this.setUserVideoAccess(users, addUserIp, true);
                            this.setState({ showPreview: !showPreview });
                          } else {
                            this.setState({ showPreview: !showPreview, videoOpen: !showPreview });
                          }
                        }}
                      >
                        <div className="arrowDown" />
                        <p>
                        WATCH
                          {' '}
                          {showPreview ? 'EXTENDED' : 'PREVIEW'}
                        </p>
                      </button>
                    </div>
                    <div className="payments">
                      <StripeCheckout
                        stripeKey="pk_test_ug5eEUpY4GbVR6xrl2uULelO00OswKbtVo"
                        token={this.foobar}
                        amount={amount}
                      />
                    </div>
                  </div>
                  <div className="merch" />
                </Fragment>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}
