import React, { Fragment } from 'react';
import Image from 'react-progressive-image';
import classNames from 'classnames';

import './index.css';

export default ({
  src, placeholder, className, animate,
}) => (
  <div className={`imageContainer ${className}`}>
    <Image src={src} placeholder={placeholder}>
      {(srcReady, loading) => (
        <Fragment>
          <div className={classNames('loadingContainer', { animationLoader: loading && animate })} />
          <img
            src={srcReady}
            alt="Dash in Between"
            className={classNames({ placeholderBlur: loading })}
          />
        </Fragment>
      )}
    </Image>
  </div>
);
