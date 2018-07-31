import * as React from 'react';
import * as Radium from 'radium';
import {ModalWrapper, ModalHeader, ModalFooter} from 'haiku-ui-common/lib/react/Modal';
import {BTN_STYLES} from '../../styles/btnShared';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  wrapper: {
    fontSize: 14,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: Palette.GRAY,
  },
  modalWrapper: {
    maxWidth: '400px',
    padding: 20,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  modalBody: {
    minHeight: 40,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 7,
  },
  table: {
    marginBottom: '30px',
  },
  tableBorder: {
    border: '1px solid black',
    textAlign: 'center',
  },
};

class ConfirmGroupUngroup extends React.Component {
  constructor (props) {
    super(props);
    this.cancelGroup = this.cancelGroup.bind(this);
    this.confirmGroup = this.confirmGroup.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.renderTableLine = this.renderTableLine.bind(this);
  }

  cancelGroup () {
    this.props.setGroupUngroupAnswerAndClose(false, this.props.groupOrUngroup);
  }

  confirmGroup () {
    this.props.setGroupUngroupAnswerAndClose(true, this.props.groupOrUngroup);
  }

  renderTableLine (component) {
    return (
      <tr style={STYLES.tableBorder} key={component.elementId} >
        <td style={STYLES.tableBorder}>{component.title}</td>
        <td style={STYLES.tableBorder}>{component.hasTransition ? 'Yes' : '----'}</td>
        <td style={STYLES.tableBorder}>{component.hasExpression ? 'Yes' : '----'}</td>
      </tr>
    );
  }

  renderTable () {
    return (
      <div style={STYLES.table}>
        <table style={STYLES.tableBorder}>
          <tbody>
            <tr style={STYLES.tableBorder}>
              <th style={STYLES.tableBorder}>Component</th>
              <th style={STYLES.tableBorder}>Transition(s)</th>
              <th style={STYLES.tableBorder}>Expression(s)</th>
            </tr>
            {this.props.componentsLosingTransitions.map((component) => this.renderTableLine(component))}
          </tbody>
        </table>
      </div>
    );

  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <div style={STYLES.title}>Confirm {this.props.groupOrUngroup}</div>
          <div style={STYLES.modalBody}>
            The listed transition(s) and/or expression(s) will be lost on {this.props.groupOrUngroup}. Proceed anyway?
          </div>
          {this.renderTable()}
          <ModalFooter>
            <div style={[{display: 'inline-block'}]} >
              <button
                key="group-no"
                id="group-no"
                onClick={this.cancelGroup}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  {
                    display: 'inline-block',
                    backgroundColor: 'transparent',
                    marginRight: '10px',
                  },
                ]}
              >
                <span>No</span>
              </button>

              <button
                key="group-yes"
                id="group-yes"
                onClick={this.confirmGroup}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  BTN_STYLES.btnPrimary,
                  {
                    display: 'inline-block',
                    marginRight: '10px',
                  },
                ]}
              >
                <span>Yes</span>
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      </div>
    );
  }
}

export default Radium(ConfirmGroupUngroup);
