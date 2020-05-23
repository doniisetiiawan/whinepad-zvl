// eslint-disable-next-line max-len
/* eslint-disable react/prop-types,jsx-a11y/click-events-have-key-events,jsx-a11y/mouse-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class Rating extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: props.defaultValue,
      tmpRating: props.defaultValue,
    };
  }

  getValue = () => this.state.rating;

  setTemp = (rating) => {
    this.setState({ tmpRating: rating });
  };

  setRating = (rating) => {
    this.setState({
      tmpRating: rating,
      rating,
    });
  };

  reset = () => {
    this.setTemp(this.state.rating);
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setRating(nextProps.defaultValue);
  };

  render() {
    const stars = [];
    for (let i = 1; i <= this.props.max; i++) {
      stars.push(
        <span
          className={i <= this.state.tmpRating ? 'RatingOn' : null}
          key={i}
          onClick={!this.props.readonly && this.setRating(i)}
          onMouseOver={!this.props.readonly && this.setTemp(i)}
        >
          &#9734;
        </span>,
      );
    }

    return (
      <div
        className={classNames({
          Rating: true,
          RatingReadonly: this.props.readonly,
        })}
        onMouseOut={this.reset}
      >
        {stars}
        {this.props.readonly || !this.props.id ? null : (
          <input
            type="hidden"
            id={this.props.id}
            value={this.state.rating}
          />
        )}
      </div>
    );
  }
}

export default Rating;

Rating.propTypes = {
  defaultValue: PropTypes.number,
  max: PropTypes.number,
  // eslint-disable-next-line react/require-default-props
  readonly: PropTypes.bool,
};

Rating.defaultProps = {
  defaultValue: 0,
  max: 3,
};
