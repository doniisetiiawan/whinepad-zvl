/* eslint-disable react/no-access-state-in-setstate,react/no-string-refs,react/prop-types */
import React, { Component } from 'react';
import Button from './Button';
import Dialog from './Dialog';
import Excel from './Excel';
import Form from './Form';

class Whinepad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.initialData,
      addnew: false,
    };
    this._preSearchData = null;
  }

  _addNewDialog = () => {
    this.setState({ addnew: true });
  };

  _addNew = (action) => {
    if (action === 'dismiss') {
      this.setState({ addnew: false });
      return;
    }
    const data = Array.from(this.state.data);
    data.unshift(this.refs.form.getData());
    this.setState({
      addnew: false,
      data,
    });
    this._commitToStorage(data);
  };

  _onExcelDataChange = (data) => {
    this.setState({ data });
    this._commitToStorage(data);
  };

  _commitToStorage = (data) => {
    localStorage.setItem('data', JSON.stringify(data));
  };

  _startSearching = () => {
    this._preSearchData = this.state.data;
  };

  _doneSearching = () => {
    this.setState({
      data: this._preSearchData,
    });
  };

  _search = (e) => {
    const needle = e.target.value.toLowerCase();
    if (!needle) {
      this.setState({ data: this._preSearchData });
      return;
    }
    const fields = this.props.schema.map((item) => item.id);
    const searchdata = this._preSearchData.filter((row) => {
      for (let f = 0; f < fields.length; f++) {
        if (row[fields[f]].toString().toLowerCase().indexOf(needle) > -1) {
          return true;
        }
      }
      return false;
    });
    this.setState({ data: searchdata });
  };

  render() {
    return (
      <div className="Whinepad">
        <div className="WhinepadToolbar">
          <div className="WhinepadToolbarAdd">
            <Button
              onClick={this._addNewDialog()}
              className="WhinepadToolbarAddButton"
            >
              + add
            </Button>
          </div>
          <div className="WhinepadToolbarSearch">
            <input
              placeholder="Search..."
              onChange={(e) => this._search(e)}
              onFocus={this._startSearching()}
              onBlur={this._doneSearching()}
            />
          </div>
        </div>
        <div className="WhinepadDatagrid">
          <Excel
            schema={this.props.schema}
            initialData={this.state.data}
            onDataChange={this._onExcelDataChange()}
          />
        </div>
        {this.state.addnew
          ? (
            <Dialog
              modal
              header="Add new item"
              confirmLabel="Add"
              onAction={this._addNew()}
            >
              <Form
                ref="form"
                fields={this.props.schema}
              />
            </Dialog>
          )
          : null}
      </div>
    );
  }
}

export default Whinepad;
