import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

import './index.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    Sentry.captureException(`ERROR-BOUNDARY - ${error, info}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="errorBoundary">
          <h1>There was an error. </h1>
          <p>You are probably using an older browser version. Please consider updating.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}