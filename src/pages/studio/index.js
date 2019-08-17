import React, { Component, Fragment } from 'react';
import { DateRangePicker } from 'react-date-range';
import classNames from 'classnames';

import Chart from './components/chart';
import Promos from './components/promos';
import Videos from './components/videos';

import './index.css';
import 'react-date-range/dist/theme/default.css';
import 'react-date-range/dist/styles.css';

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuActive: 0,
      datePickerOpen: false,
      from: undefined,
      to: undefined,
      startDate: '',
      endDate: '',
    };
  }

  // BUILD PAGE FOR DASH SERIES VIDEOS <<< (old pick a card page - maybe add pick a card videos too) - don't suggest series
  // Find latest uploade YOUTUBE videos - can authorize app to read or just scrape? look into API

  render() {
    const { state: { menuActive, datePickerOpen, from, to, startDate, endDate }, props: { userId } } = this;
    return (
      <Fragment>
        <div className="studioMenu">
          <div className="left">
            <div 
              className={classNames({ active: menuActive === 0 })}
              onClick={() => this.setState({ menuActive: 0 })}
            >
              Analytics
            </div>
            <div 
              className={classNames({ active: menuActive === 1 })}
              onClick={() => this.setState({ menuActive: 1 })}
            >
              Videos
            </div>
            <div 
              className={classNames({ active: menuActive === 2 })}
              onClick={() => this.setState({ menuActive: 2 })}
            >
              Settings
            </div>
          </div>
          <div className="rightMenu"> 
            {!datePickerOpen && <button 
              className="dropdown"
              onClick={() => this.setState({ datePickerOpen: true })}
            >
              Select date <i className="fas fa-caret-down" />
            </button>}
            {datePickerOpen && <div className="datePicker">
              <DateRangePicker
                ranges={[{ startDate, endDate, key: 'selection' }]}
                onChange={({ selection: { startDate, endDate } }) => {
                  this.setState({ startDate, endDate })
                }}
              />
                <div className="buttons">
                <button onClick={() => this.setState({ datePickerOpen: false })}>CANCEL</button>
                <button onClick={() => { 
                  const from = startDate.toISOString().substr(0, 10);
                  const to = endDate.toISOString().substr(0, 10);
                  this.setState({ datePickerOpen: false, from, to });
                }}>APPLY</button>
              </div>
            </div>}
          </div>
        </div>
        {menuActive === 0 && <Fragment>
          <Chart userId={userId} from={from} to={to} />
          <div className="videosAndPromos">
            <Promos from={from} to={to} />
            <Videos from={from} to={to} />
          </div>
        </Fragment>}
      </Fragment>
    )
  }
};