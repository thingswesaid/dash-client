import React from 'react';
import { Query } from 'react-apollo';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { STUDIO_PAGE_QUERY } from '../../../../operations/queries';
import Loader from '../../../../shared-components/loader';
import Error from '../../../../shared-components/error';

import './index.css';
import 'react-date-range/dist/theme/default.css';
import 'react-date-range/dist/styles.css';

export default ({ userId, from, to }) => (
  <Query query={STUDIO_PAGE_QUERY} variables={{ userId, from, to }}>
    {({ loading, error, data }) => {
      if (loading) { return <div style={{ height: '428px' }}><Loader /></div>; }
      else if (error) { return <Error message="We will be right back!" />; }
      else if (data.ordersAnalytics.error) return <div className="noUserAccess">{data.studioPage.error.toUpperCase()}</div>;
      const { list, count, totalAmount } = data.ordersAnalytics;
      const orders = JSON.parse(list);

      return (
        <div className="ordersChart">
          <div className="totals">
            <div className="section">
              <p className="title">Orders</p>
              <p className="count">{count}</p>
            </div>
            <div className="section">
              <p className="title">Your estimated revenue</p>
              <p className="count"><span>$</span>{totalAmount.toFixed(2)}</p>
            </div>
          </div>
          {orders.length && <AreaChart width={900} height={200} data={orders} syncId="anyId"
            margin={{top: 10, right: 30, left: 0, bottom: 0}}
            width={800}
          >
            <CartesianGrid  stroke="#f5f5f5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value, name) => name === 'amount' ? `$${value.toFixed(2)}` : value} />
            <Area type='monotone' dataKey='amount' stroke='#76aef8' fill='#76aef8' strokeWidth={0} />
            <Area type='monotone' dataKey='count' stroke='#7ceec4' fill='#7ceec4' strokeWidth={0} />
          </AreaChart>}
          {!orders.length && <div>NO ORDERS FOUND</div>}
        </div>
      )
    }}
  </Query>
)


const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);