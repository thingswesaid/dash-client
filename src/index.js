import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import { 
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import AppFrame from './components/app-frame'
import FeedPage from './pages/FeedPage'
import DraftsPage from './pages/DraftsPage'
import CreatePage from './pages/CreatePage'
import DetailPage from './pages/DetailPage'
import VideoPage from './pages/video'

import './index.css';

const client = new ApolloClient({ uri: 'http://localhost:4000' })

render((
  <ApolloProvider client={client}>
    <Router>
      <AppFrame>
        <Switch>
          <Route exact path="/" component={FeedPage} />
          <Route path="/drafts" component={DraftsPage} />
          <Route path="/create" component={CreatePage} />
          <Route path="/post/:id" component={DetailPage} />
          <Route path="/video/:id" component={VideoPage} />
        </Switch>
      </AppFrame>
    </Router>
  </ApolloProvider>
), document.getElementById('root'));