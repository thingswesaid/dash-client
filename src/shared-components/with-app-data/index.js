import React from 'react';
import { Query } from 'react-apollo';

import { USERIP_QUERY } from '../../operations/queries';
import { COOKIE_USER_ID } from '../../constants';
import { getCookie } from '../../cookieUtils';
import Loader from '../loader';
import Error from '../error';

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

export const AppContext = React.createContext();

export function withAppData(WrappedComponent) {
  class WithAppData extends React.Component {
    render() {
      const userId = getCookie(COOKIE_USER_ID);

      return (
        <Query query={USERIP_QUERY}>
          {({ data, loading, error }) => {
            if (loading) { return <Loader />; }
            if (error) { return <Error message="We will be right back!" />; } /* log to sumo or similar */
            const { userIp: { ip: userIp, location } } = data;

            return (
              <AppContext.Provider value={{ ...this.state, ...{ userIp, userId, location } }}>
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
