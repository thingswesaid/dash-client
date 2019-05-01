import React from 'react';
import Image from 'react-progressive-image';
import classNames from 'classnames';

import './index.css';

export default ({ src, placeholder, className }) => (
  <div className={`imageContainer ${className}`}>
    <Image src={src} placeholder={placeholder}>
      {(srcReady, loading) => (
        <img
          src={srcReady}
          alt="Dash in Between"
          className={classNames({ placeholderBlur: loading })}
        />
      )}
    </Image>
  </div>
);
