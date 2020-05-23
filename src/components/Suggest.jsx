/* eslint-disable react/prop-types,jsx-a11y/control-has-associated-label,react/no-array-index-key */
import React, { Component } from 'react';

class Suggest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  getValue = () => this.state.value;

  render() {
    const randomid = Math.random()
      .toString(16)
      .substring(2);

    return (
      <div>
        <input
          list={randomid}
          defaultValue={this.props.defaultValue}
          onChange={(e) => this.setState({ value: e.target.value })}
          id={this.props.id}
        />
        <datalist id={randomid}>
          {this.props.options.map((item, idx) => (
            <option value={item} key={idx} />
          ))}
        </datalist>
      </div>
    );
  }
}

export default Suggest;
