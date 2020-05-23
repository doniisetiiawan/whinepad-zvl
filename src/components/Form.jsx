/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import FormInput from './FormInput';
import Rating from './Rating';

class Form extends Component {
  getData = () => {
    const data = {};
    this.props.fields.forEach(
      (field) => (data[field.id] = this.refs[field.id].getValue()),
    );
    return data;
  };

  render() {
    return (
      <form className="Form">
        {this.props.fields.map((field) => {
          const prefilled = this.props.initialData
            && this.props.initialData[field.id];
          if (!this.props.readonly) {
            return (
              <div className="FormRow" key={field.id}>
                <label
                  className="FormLabel"
                  htmlFor={field.id}
                >
                  {field.label}:
                </label>
                <FormInput
                  {...field}
                  ref={field.id}
                  defaultValue={prefilled}
                />
              </div>
            );
          }
          if (!prefilled) {
            return null;
          }
          return (
            <div className="FormRow" key={field.id}>
              <span className="FormLabel">
                {field.label}:
              </span>
              {field.type === 'rating' ? (
                <Rating
                  readonly
                  defaultValue={parseInt(prefilled, 10)}
                />
              ) : (
                <div>{prefilled}</div>
              )}
            </div>
          );
        }, this)}
      </form>
    );
  }
}

export default Form;
