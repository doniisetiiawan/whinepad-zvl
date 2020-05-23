// eslint-disable-next-line max-len
/* eslint-disable react/require-default-props,jsx-a11y/anchor-has-content,react/jsx-props-no-spreading,react/prop-types */
import React from 'react';
import classNames from 'classnames';

import './Button.css';

function Button(props) {
  return props.href ? (
    <a
      {...props}
      className={classNames(
        'Button',
        props.className,
      )}
    />
  ) : (
    <button
      type="button"
      {...props}
      className={classNames(
        'Button',
        props.className,
      )}
    />
  );
}

export default Button;
