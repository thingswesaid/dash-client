import React from 'react';
import { Query } from 'react-apollo';

import { USERIP_QUERY } from '../../operations/queries';
import Loader from '../loader';
import Error from '../error';

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

const defaultState = {
  cookieEmail: '',
};

export const AppContext = React.createContext(defaultState);

export function withAppData(WrappedComponent) {
  class WithAppData extends React.Component {
    render() {
      return (
        <Query query={USERIP_QUERY}>
          {({ data, loading, error }) => {
            if (loading) { return <Loader />; }
            if (error) { return <Error error={error} />; } /* log to sumo or similar */
            const { userIp } = data;
            return (
              <AppContext.Provider value={{ ...this.state, ...{ userIp } }}>
                <WrappedComponent {...this.props} />
              </AppContext.Provider>
            );
          }}
        </Query>
      );
    }
  }

  WithAppData.displayName = `WithAppData(${getDisplayName(
    WrappedComponent,
  )})`;

  return WithAppData;
}
