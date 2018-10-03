import * as React from 'react';
import * as Radium from 'radium';
import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import {SuccessIconSVG, InfoIconSVG, WarningIconSVG, DangerIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';

const STYLES = {
  cap: {
    width: '32px',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    backgroundColor: Palette.GREEN,
  },
  info: {
    backgroundColor: Palette.BLUE,
  },
  warning: {
    backgroundColor: Palette.ORANGE,
  },
  danger: {
    backgroundColor: Palette.RED,
  },
  error: {
    backgroundColor: Palette.RED,
  },
  closer: {
    backgroundColor: Palette.GRAY,
    color: Palette.SUNSTONE,
    padding: '3px 7px 2px 7px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    fontSize: '11px',
    position: 'absolute',
    top: '8px',
    right: '8px',
    cursor: 'pointer',
    WebkitUserSelect: 'none',
  },
  lightCloser: {
    backgroundColor: Palette.FATHER_COAL,
    color: Palette.SUNSTONE,
  },
  container: {
    WebkitUserSelect: 'none',
    backgroundColor: Palette.COAL,
    width: '260px',
    padding: '9px 6px 9px 46px',
    zIndex: 3,
    position: 'relative',
    float: 'right',
    marginTop: '14px',
    marginRight: '14px',
    borderRadius: '3px',
    color: Palette.SUNSTONE,
    overflow: 'hidden',
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    pointerEvents: 'auto',
  },
  title: {
    fontSize: '14.5px',
    fontStyle: 'italic',
    lineHeight: 1.3,
    color: Palette.SUNSTONE,
    pointerEvents: 'none',
  },
  body: {
    fontSize: '12px',
    marginTop: '8px',
    color: Palette.ROCK,
    width: '190px',
  },
};

class Toast extends React.Component {
  constructor () {
    super();

    this.closeNotice = this.closeNotice.bind(this);
  }

  closeNotice () {
    this.props.removeNotice(this.props.myKey);
  }

  render () {
    const {toastType, toastTitle, toastMessage, closeText, lightScheme, toastCount} = this.props;
    let icon;

    if (toastType === 'info') {
      icon = <InfoIconSVG />;
    } else if (toastType === 'success') {
      icon = <SuccessIconSVG />;
    } else if (toastType === 'warning') {
      icon = <WarningIconSVG />;
    } else if (toastType === 'danger' || toastType === 'error') {
      icon = <DangerIconSVG />;
    }

    return (
      <div style={STYLES.container}
        id="toast"
        className="toast">
        <div style={[
          STYLES.cap,
          STYLES[toastType],
          lightScheme && {backgroundColor: Color(STYLES[toastType].backgroundColor).fade(0.27)},
        ]}
          onClick={this.closeNotice}>{icon}
        </div>
        <div style={[STYLES.title]}>{toastTitle}{(toastCount > 1) ? ` (${toastCount})` : ''}</div>
        <div style={[STYLES.body]}>{toastMessage}</div>
        <span
          style={[STYLES.closer, lightScheme && STYLES.lightCloser]}
          onClick={this.closeNotice}>{closeText || 'Got it'}
        </span>
      </div>
    );
  }
}

export default Radium(Toast);
