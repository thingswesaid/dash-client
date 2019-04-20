import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { withAppData, AppContext } from './shared-components/with-app-data';
import AppFrame from './shared-components/app-frame';
import FeedPage from './pages/FeedPage';
import VideoPage from './pages/video';

import './index.css';

const client = new ApolloClient({ uri: 'https://dash-prisma-client.herokuapp.com/' });
// const client = new ApolloClient({ uri: 'http://localhost:4000' });

document.cookie = 'dash-user-email=smanuel.dicristo@icloud.com;path=/'; // temp

const AppFrameWithData = withAppData(AppFrame);

// add
// 404 page
// unsubscribe email page
// terms and conditions page (content centered with universe icons on the sides)
// emails page (if it's possible to serve them from this site)
// email your account has been suspended, too many ips using it - contact us info@dashinbetween.com

render((
  <ApolloProvider client={client}>
    <Router>
      <AppFrameWithData>
        <AppContext.Consumer>
          {({ cookieEmail, userIp, triggerNotification }) => (
            <Switch>
              <Route exact path="/" component={FeedPage} />
              <Route
                path="/video/:id"
                render={
                  ({ match: { params: { id } } }) => (
                    <VideoPage cookieEmail={cookieEmail} videoId={id} userIp={userIp} triggerNotification={triggerNotification} />
                  )
                }
              />
            </Switch>
          )}
        </AppContext.Consumer>
      </AppFrameWithData>
    </Router>
  </ApolloProvider>
), document.getElementById('root'));
