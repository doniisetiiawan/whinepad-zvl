// eslint-disable-next-line max-len
/* eslint-disable react/prop-types,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import Button from './Button';

class Dialog extends Component {
  componentWillUnmount = () => {
    document.body.classList.remove('DialogModalOpen');
  };

  componentDidMount = () => {
    if (this.props.modal) {
      document.body.classList.add('DialogModalOpen');
    }
  };

  render() {
    return (
      <div
        className={
          this.props.modal ? 'Dialog DialogModal' : 'Dialog'
        }
      >
        <div
          className={
            this.props.modal ? 'DialogModalWrap' : null
          }
        >
          <div className="DialogHeader">
            {this.props.header}
          </div>
          <div className="DialogBody">
            {this.props.children}
          </div>
          <div className="DialogFooter">
            {this.props.hasCancel ? (
              <span
                className="DialogDismiss"
                onClick={this.props.onAction('dismiss')}
              >
                Cancel
              </span>
            ) : null}
            <Button
              onClick={this.props.onAction(
                this.props.hasCancel ? 'confirm' : 'dismiss',
              )}
            >
              {this.props.confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;
