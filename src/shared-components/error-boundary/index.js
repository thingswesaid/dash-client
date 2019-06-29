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

  componentDidCatch(error) {
    Sentry.captureException(`ERROR-BOUNDARY - ${error}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="errorBoundary">
          <h1>There was an error. </h1>
          <p>We apologize for the inconvenience. Please try again later.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}