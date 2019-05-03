/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { Query } from 'react-apollo';
import idGenerator from 'react-id-generator';

import { SEARCH_QUERY } from '../../operations/queries';
import Image from '../image';
import './index.css';

export default ({ close }) => (
  <Query query={SEARCH_QUERY} variables={{ keywords: '' }}>
    {({
      loading, error, data, refetch,
    }) => {
      const videos = data && data.videos ? data.videos : [];
      return (
        <div className="search">
          <input
            autoFocus
            className="search"
            placeholder="taurus love april"
            onKeyUp={(e) => { refetch({ keywords: e.target.value }); }}
          />
          <div className="dropdown">
            {
              videos.map(({
                link, image, placeholder, title,
              }) => (
                <div className="item" key={idGenerator()}>
                  <a href={link}>
                    <Image src={image} placeholder={placeholder} className="itemContainer shadow" />
                    <p>{title}</p>
                  </a>
                </div>
              ))
            }
          </div>
          <div
            className="dropdownBackground"
            onClick={close}
            onKeyDown={close}
            role="presentation"
          />
        </div>
      );
    }}
  </Query>
);
