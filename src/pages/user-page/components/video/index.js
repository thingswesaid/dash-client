import React from 'react';
import Image from '../../../../shared-components/image';

import './index.css';

export default ({ video: { id, image, placeholder } }) => (
  <a href={`/video/${id.slice(-5)}`}>
    <Image src={image} placeholder={placeholder} className="videoCover" />
  </a>
)