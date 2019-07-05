import React from 'react';
import Image from '../../../../shared-components/image';

import './index.css';

export default ({ video: { id, imageVertical, placeholderVertical } }) => {
  return (
  <div className="videoItem">
    <a href={`/video/${id.slice(-5)}`}>
      <Image src={imageVertical} placeholder={placeholderVertical} className="videoCover" />
    </a>
  </div>
)}