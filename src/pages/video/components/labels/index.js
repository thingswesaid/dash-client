import React from 'react';
import classNames from 'classnames';
import idGenerator from 'react-id-generator';

import './index.css';

export default ({ options, selected, showPreview, onClick, onClickOption }) => (
  <div className="labelContainer">
    {
      options.length ? options.map((opt, index) => 
        <button
          key={idGenerator()}
          type="button"
          className={classNames('label', { selected: selected === index })}
          onClick={() => { onClickOption(index) }}
          onKeyPress={() => { onClickOption(index) }}
        >
          <p>GROUP {index + 1}</p>
        </button>
      ) : (
        <button
          type="button"
          className={classNames('label', { shake: showPreview })}
          style={{ width: "140px", fontWeight: "normal" }}
          onClick={onClick}
          onKeyPress={onClick}
        >
          <p>{showPreview ? `SWITCH TO EXTENDED` : `SWITCH TO PREVIEW`}</p>
        </button>
      )
    }
  </div>
)
