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
import DraftsPage from './pages/DraftsPage';
import CreatePage from './pages/CreatePage';
import DetailPage from './pages/DetailPage';
import VideoPage from './pages/video';

import './index.css';

const client = new ApolloClient({ uri: 'https://dash-prisma-client.herokuapp.com/' });
// const client = new ApolloClient({ uri: 'http://localhost:4000' });
console.log('PROCESS >> ', process.env);
document.cookie = 'user-email=manuel.dicristo@icloud.com;path=/';

const AppFrameWithData = withAppData(AppFrame);

render((
  <ApolloProvider client={client}>
    <Router>
      <AppFrameWithData>
        <AppContext.Consumer>
          {({ userEmail, userIp }) => (
            <Switch>
              <Route exact path="/" component={FeedPage} />
              <Route path="/drafts" component={DraftsPage} />
              <Route path="/create" component={CreatePage} />
              <Route path="/post/:id" component={DetailPage} />
              <Route
                path="/video/:id"
                render={
                  ({ match: { params: { id } } }) => (
                    <VideoPage userEmail={userEmail} videoId={id} userIp={userIp} />
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
