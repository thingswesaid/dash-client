import React from 'react';
import Image from 'react-progressive-image';
import classNames from 'classnames';

import './index.css';

export default ({ image, placeholder, className }) => (
  <Image src={image} placeholder={placeholder}>
    {(src, loading) => (
      <img
        src={src}
        alt="Dash in Between"
        className={classNames(className, { placeholderBlur: loading })}
      />
    )}
  </Image>
);
