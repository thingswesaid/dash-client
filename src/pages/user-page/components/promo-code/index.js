import React, { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast as notification } from 'react-toastify';
import classNames from 'classnames';

import './index.css';

export default ({ promoCode: { code, valid, endDate } }) => {
  const now = new Date();
  const promoEndDate = new Date(endDate);
  const isValidAndActive = valid && promoEndDate > now;
  const validThru = endDate ? endDate.substring(0, 15) : '';
  const validSection = isValidAndActive ? `Valid thru ${validThru}` : 'Promo used or expired'
  return (
    <CopyToClipboard text={code.toUpperCase()} onCopy={() => { if (isValidAndActive) notification('Code copied to clipboard.')} }>
      <div className={classNames('promoCodeItem', { active: isValidAndActive })}>
        <p>Use your promo code</p>
        <p className="code">{code.toUpperCase()}</p>
        <p>{validSection}</p>
      </div>
    </CopyToClipboard>
  )
}