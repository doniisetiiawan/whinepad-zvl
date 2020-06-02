// eslint-disable-next-line max-len
/* eslint-disable react/no-access-state-in-setstate,react/prop-types,react/no-string-refs,react/no-array-index-key */
import React, { Component } from 'react';
import classNames from 'classnames';
import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import FormInput from './FormInput';
import Rating from './Rating';

class Excel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.initialData,
      sortby: null, // schema.id
      descending: false,
      edit: null, // [row index, schema.id],
      dialog: null, // {type, idx}
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({ data: nextProps.initialData });
  };

  _fireDataChange = (data) => {
    this.props.onDataChange(data);
  };

  _sort = (key) => {
    const data = Array.from(this.state.data);
    const descending = this.state.sortby === key && !this.state.descending;
    data.sort((a, b) => (descending
      ? (a[key] < b[key] ? 1 : -1)
      : (a[key] > b[key] ? 1 : -1)));
    this.setState({
      data,
      sortby: key,
      descending,
    });
    this._fireDataChange(data);
  };

  _showEditor = (e) => {
    this.setState({
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        key: e.target.dataset.key,
      },
    });
  };

  _save = (e) => {
    e.preventDefault();
    const value = this.refs.input.getValue();
    const data = Array.from(this.state.data);
    data[this.state.edit.row][this.state.edit.key] = value;
    this.setState({
      edit: null,
      data,
    });
    this._fireDataChange(data);
  };

  _actionClick = (rowidx, action) => {
    this.setState({ dialog: { type: action, idx: rowidx } });
  };

  _deleteConfirmationClick = (action) => {
    if (action === 'dismiss') {
      this._closeDialog();
      return;
    }
    const data = Array.from(this.state.data);
    data.splice(this.state.dialog.idx, 1);
    this.setState({
      dialog: null,
      data,
    });
    this._fireDataChange(data);
  };

  _closeDialog = () => {
    this.setState({ dialog: null });
  };

  _saveDataDialog = (action) => {
    if (action === 'dismiss') {
      this._closeDialog();
      return;
    }
    const data = Array.from(this.state.data);
    data[this.state.dialog.idx] = this.refs.form.getData();
    this.setState({
      dialog: null,
      data,
    });
    this._fireDataChange(data);
  };

  _renderDialog = () => {
    if (!this.state.dialog) {
      return null;
    }
    switch (this.state.dialog.type) {
      case 'delete':
        return this._renderDeleteDialog();
      case 'info':
        return this._renderFormDialog(true);
      case 'edit':
        return this._renderFormDialog();
      default:
        throw Error(`Unexpected dialog type ${this.state.dialog.type}`);
    }
  };

  _renderDeleteDialog = () => {
    const first = this.state.data[this.state.dialog.idx];
    const nameguess = first[Object.keys(first)[0]];
    return (
      <Dialog
        modal
        header="Confirm deletion"
        confirmLabel="Delete"
        onAction={this._deleteConfirmationClick()}
      >
        {`Are you sure you want to delete "${nameguess}"?`}
      </Dialog>
    );
  };

  _renderFormDialog = (readonly) => (
    <Dialog
      modal
      header={readonly ? 'Item info' : 'Edit item'}
      confirmLabel={readonly ? 'ok' : 'Save'}
      hasCancel={!readonly}
      onAction={this._saveDataDialog()}
    >
      <Form
        ref="form"
        fields={this.props.schema}
        initialData={this.state.data[this.state.dialog.idx]}
        readonly={readonly}
      />
    </Dialog>
  );

  _renderTable() {
    return (
      <table>
        <thead>
          <tr>{
          this.props.schema.map((item) => {
            if (!item.show) {
              return null;
            }
            let title = item.label;
            if (this.state.sortby === item.id) {
              title += this.state.descending ? ' \u2191' : ' \u2193';
            }
            return (
              <th
                className={`schema-${item.id}`}
                key={item.id}
                onClick={() => this._sort(item.id)}
              >
                {title}
              </th>
            );
          }, this)
        }
            <th className="ExcelNotSortable">Actions</th>
          </tr>
        </thead>
        <tbody onDoubleClick={(e) => this._showEditor(e)}>
          {this.state.data.map((row, rowidx) => (
            <tr key={rowidx}>{
              Object.keys(row).map((cell, idx) => {
                const schema = this.props.schema[idx];
                if (!schema || !schema.show) {
                  return null;
                }
                const isRating = schema.type === 'rating';
                const { edit } = this.state;
                let content = row[cell];
                if (!isRating && edit && edit.row === rowidx && edit.key === schema.id) {
                  content = (
                    <form onSubmit={this._save()}>
                      <FormInput ref="input" {...schema} defaultValue={content} />
                    </form>
                  );
                } else if (isRating) {
                  content = <Rating readonly defaultValue={Number(content)} />;
                }
                return (
                  <td
                    className={classNames({
                      [`schema-${schema.id}`]: true,
                      ExcelEditable: !isRating,
                      ExcelDataLeft: schema.align === 'left',
                      ExcelDataRight: schema.align === 'right',
                      ExcelDataCenter: schema.align !== 'left' && schema.align !== 'right',
                    })}
                    key={idx}
                    data-row={rowidx}
                    data-key={schema.id}
                  >
                    {content}
                  </td>
                );
              }, this)
}
              <td className="ExcelDataCenter">
                <Actions onAction={(rowidx) => this._actionClick(rowidx)} />
              </td>
            </tr>
          ), this)}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="Excel">
        {this._renderTable()}
        {this._renderDialog()}
      </div>
    );
  }
}

export default Excel;
