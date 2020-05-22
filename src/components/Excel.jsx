// eslint-disable-next-line max-len
/* eslint-disable jsx-a11y/click-events-have-key-events,react/no-access-state-in-setstate,jsx-a11y/no-noninteractive-element-interactions,no-nested-ternary,react/no-array-index-key,jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Excel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.initialData,
      sortby: null,
      descending: false,
      edit: null,
      search: false,
    };

    this._log = [];
    this._preSearchData = null;
  }

  _sort = (e) => {
    const column = e.target.cellIndex;
    const data = this.state.data.slice();
    const descending = this.state.sortby === column
      && !this.state.descending;
    data.sort((a, b) => (descending
      ? a[column] < b[column]
        ? 1
        : -1
      : a[column] > b[column]
        ? 1
        : -1));
    this._logSetState({
      data,
      sortby: column,
      descending,
    });
  };

  _showEditor = (e) => {
    this._logSetState({
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        cell: e.target.cellIndex,
      },
    });
  };

  _save = (e) => {
    e.preventDefault();
    const input = e.target.firstChild;
    const data = this.state.data.slice();
    data[this.state.edit.row][this.state.edit.cell] = input.value;
    this._logSetState({
      edit: null,
      data,
    });
  };

  _renderTable = () => (
    <table>
      <thead onClick={this._sort}>
        <tr>
          {this.props.headers.map((title, idx) => {
            if (this.state.sortby === idx) {
              title += this.state.descending
                ? ' \u2191'
                : ' \u2193';
            }
            return <th key={title}>{title}</th>;
          })}
        </tr>
      </thead>
      <tbody onDoubleClick={this._showEditor}>
        {this._renderSearch()}
        {this.state.data.map((row, rowidx) => (
          <tr key={rowidx}>
            {row.map((cell, idx) => {
              let content = cell;
              const { edit } = this.state;

              if (
                edit
              && edit.row === rowidx
              && edit.cell === idx
              ) {
                content = (
                  <form onSubmit={this._save}>
                    <input
                      type="text"
                      name="name"
                      defaultValue={cell}
                    />
                  </form>
                );
              }

              return (
                <td key={idx} data-row={rowidx}>
                  {content}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  _renderToolbar = () => (
    <div className="toolbar">
      <button
        type="button"
        onClick={this._toggleSearch}
        className="toolbar"
      >
        search
      </button>
      <a
        onClick={(ev) => this._download(ev, 'json')}
        href="data.json"
      >
        Export JSON
      </a>
      <a
        onClick={(ev) => this._download(ev, 'csv')}
        href="data.csv"
      >
        Export CSV
      </a>
    </div>
  );

  _toggleSearch = () => {
    if (this.state.search) {
      this._logSetState({
        data: this._preSearchData,
        search: false,
      });
      this._preSearchData = null;
    } else {
      this._preSearchData = this.state.data;
      this._logSetState({
        search: true,
      });
    }
  };

  _renderSearch = () => {
    if (!this.state.search) {
      return null;
    }
    return (
      <tr onChange={this._search}>
        {this.props.headers.map((_ignore, idx) => (
          <td key={idx}>
            <input type="text" data-idx={idx} />
          </td>
        ))}
      </tr>
    );
  };

  _search = (e) => {
    const needle = e.target.value.toLowerCase();
    if (!needle) {
      this._logSetState({ data: this._preSearchData });
    }
    const { idx } = e.target.dataset;
    const searchdata = this._preSearchData.filter(
      (row) => row[idx].toString().toLowerCase().indexOf(needle)
        > -1,
    );
    this._logSetState({ data: searchdata });
  };

  componentDidMount = () => {
    document.onkeydown = (e) => {
      if (e.altKey && e.shiftKey && e.keyCode === 82) {
        // ALT+SHIFT+R(eplay)
        this._replay();
      }
    };
  };

  _replay = () => {
    if (this._log.length === 0) {
      console.warn('No state to replay yet');
    }
    let idx = -1;
    const interval = setInterval(() => {
      idx++;
      if (idx === this._log.length - 1) {
        // the end
        clearInterval(interval);
      }
      this.setState(this._log[idx]);
    }, 1000);
  };

  _logSetState = (newState) => {
    // remember the old state in a clone
    this._log.push(
      JSON.parse(
        JSON.stringify(
          this._log.length === 0 ? this.state : newState,
        ),
      ),
    );
    this.setState(newState);
  };

  _download = (ev, format) => {
    const contents = format === 'json'
      ? JSON.stringify(this.state.data)
      : this.state.data.reduce(
        (result, row) => `${
          result
          + row.reduce(
            (rowresult, cell, idx) => `${rowresult}"${cell.replace(
              /"/g,
              '""',
            )}"${idx < row.length - 1 ? ',' : ''}`,
            '',
          )
        }\n`,
        '',
      );

    const URL = window.URL || window.webkitURL;
    const blob = new Blob([contents], {
      type: `text/${format}`,
    });
    ev.target.href = URL.createObjectURL(blob);
    ev.target.download = `data.${format}`;
  };

  render() {
    return (
      <div className="Excel">
        {this._renderToolbar()}
        {this._renderTable()}
      </div>
    );
  }
}

export default Excel;

Excel.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialData: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string),
  ).isRequired,
};
