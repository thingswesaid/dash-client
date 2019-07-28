import React, { Component, Fragment } from 'react';
import { Adopt } from 'react-adopt';
// import { XYPlot, LineSeries, VerticalBarSeries, MarkSeries } from 'react-vis';

import { studioPageQuery } from '../../operations/queries';
import Loader from '../../shared-components/loader';
import Error from '../../shared-components/error';

import './index.css';

const mapper = {
  studioPageQuery,
};

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // https://fvsch.com/svg-gradient-fill/

  render() {
    const { props: { userId } } = this;
    return (
      <Adopt mapper={mapper} userId={userId}>
        {({ 
          studioPageQuery: studioPageData, 
        }) => {
          const { data, loading, error, refetch: fetchAnalytics } = studioPageData;
          if (loading) { return <Loader />; }
          else if (error) { return <Error message="We will be right back!" />; }
          else if (data.studioPage.error) return <div className="noUserAccess">{data.studioPage.error.toUpperCase()}</div>;

          const { orders: { list, count } } = data.studioPage;
          const orders = JSON.parse(list);

          // console.log('orders', orders, count);

          return (
            <Fragment>
              
            </Fragment>
          )
        }}
      </Adopt>
    );
  }
};