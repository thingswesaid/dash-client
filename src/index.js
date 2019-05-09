import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import queryString from 'query-string';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { withAppData, AppContext } from './shared-components/with-app-data';
import { deleteCookie } from './utils';
import AppFrame from './shared-components/app-frame';
import HomePage from './pages/homepage';
import VideoPage from './pages/video';
import TermsPage from './pages/terms';

import './index.css';

const uri = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_APOLLO_URI : 'http://localhost:4000';

const client = new ApolloClient({ uri, shouldBatch: true });
const AppFrameWithData = withAppData(AppFrame);
deleteCookie('dash-recent-order');

// Apollo caching

render((
  <ApolloProvider client={client}>
    <Router>
      <AppFrameWithData>
        <AppContext.Consumer>
          {({ userIp, cookieEmail }) => (
            <Switch>
              <Route
                path="/"
                exact
                render={() => (<HomePage />)}
              />
              <Route
                path="/video/:id"
                render={
                  ({ match, location: { search } }) => {
                    const { showAll } = queryString.parse(search);
                    const { params: { id } } = match;
                    return (
                      <VideoPage
                        videoId={id}
                        userIp={userIp}
                        cookieEmail={cookieEmail}
                        showAll={!!showAll}
                      />
                    );
                  }
                }
              />
              <Route
                path="/terms"
                render={() => (<TermsPage />)}
              />
            </Switch>
          )}
        </AppContext.Consumer>
      </AppFrameWithData>
    </Router>
  </ApolloProvider>
), document.getElementById('root'));
