// eslint-disable-next-line max-len
/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-tabindex,react/prop-types,jsx-a11y/no-static-element-interactions */
import React from 'react';

function Actions(props) {
  return (
    <div className="Actions">
      <span
        tabIndex="0"
        className="ActionsInfo"
        title="More info"
        onClick={props.onAction('info')}
      >
        &#8505;
      </span>
      <span
        tabIndex="0"
        className="ActionsEdit"
        title="Edit"
        onClick={props.onAction('edit')}
      >
        &#10000;
      </span>
      <span
        tabIndex="0"
        className="ActionsDelete"
        title="Delete"
        onClick={props.onAction('delete')}
      >
        x
      </span>
    </div>
  );
}

export default Actions;
