import React from 'react';
import { Query } from 'react-apollo';

import { getCookie } from '../../utils';
import { USERIP_QUERY } from '../../operations/queries';

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

const defaultState = {
  userEmail: '',
};

export const AppContext = React.createContext(defaultState);

export function withAppData(WrappedComponent) {
  class WithAppData extends React.Component {
    constructor(props) {
      super(props);
      const userEmail = getCookie('user-email');

      this.state = {
        userEmail,
      };
    }

    render() {
      return (
        <Query query={USERIP_QUERY}>
          {({ data, loading, error }) => {
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
