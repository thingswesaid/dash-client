import React from 'react';
import { Query } from 'react-apollo';

import { USERIP_QUERY } from '../../operations/queries';
import { COOKIE_EMAIL } from '../../constants';
import { getCookie } from '../../utils';
import Loader from '../loader';
import Error from '../error';

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

export const AppContext = React.createContext();

export function withAppData(WrappedComponent) {
  class WithAppData extends React.Component {
    render() {
      const cookieEmail = getCookie(COOKIE_EMAIL);
      return (
        <Query query={USERIP_QUERY}>
          {({ data, loading, error }) => {
            if (loading) { return <Loader />; }
            if (error) { return <Error error={error} />; } /* log to sumo or similar */
            const { userIp } = data;
            return (
              <AppContext.Provider value={{ ...this.state, ...{ userIp, cookieEmail } }}>
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
