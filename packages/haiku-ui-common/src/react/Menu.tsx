import * as React from 'react';
import * as assign from 'lodash.assign';
import Palette from './../Palette';
import {DownCarrotSVG} from './OtherIcons';

const Z = 99999;

const STYLES = {
  wrapper: {
    position: 'relative',
    zIndex: Z,
  },
  menu: {
    position: 'absolute',
    display: 'none',
    backgroundColor: Palette['SPECIAL_COAL'],
    color: Palette['PALE_GRAY'],
    zIndex: Z,
    top: 0,
    left: 0,
    borderRadius: '4px',
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
  },
  menuOpen: {
    display: 'inline-block',
  },
  subMenu: {},
  subMenuOpen: {
    display: 'inline-block',
    left: '100%',
    top: '0',
    zIndex: Z + 1,
  },
  menuItem: {
    position: 'relative',
    cursor: 'pointer',
    padding: '8px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    whiteSpace: 'nowrap',
    backgroundColor: Palette['SPECIAL_COAL'],
  },
  menuItemHovered: {
    backgroundColor: 'black',
  },
  menuItemDisabled: {
    color: Palette['LIGHTEST_GRAY'],
  },
  resetList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  carrot: {
    transform: 'rotate(-90deg)',
    marginLeft: '15px',
  },
};

const CLOSE_IF_SELECTED_CLASS = 'js-close-on-click';

export class Menu extends React.Component {
  state;
  props;
  triggerRef;

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggleOpen (event) {
    if (typeof this.props.onToggle === 'function') { this.props.onToggle(event); }
    this.setState({isOpen: !this.state.isOpen});
  }

  close () {
    this.setState({isOpen: false});
  }

  closeIfOptionSelected (event) {
    if (event && event.target && event.target.className === CLOSE_IF_SELECTED_CLASS) {
      this.close();
    }
  }

  getWrapperStyles () {
    if (this.props.fixed && this.triggerRef) {
      const {left, top} = this.triggerRef.getBoundingClientRect();
      const offset = this.props.offset;

      return {
        position: 'fixed',
        top: `${top - offset.top}px`,
        left: `${left + offset.left}px`,
      };
    }
  }

  render () {
    return (
      <div
        style={assign({}, STYLES.wrapper)}
        className="popover-menu-custom"
      >
        <style>
          {`
              .popover-menu-custom li:first-child {
                border-top-right-radius: 4px;
                border-top-left-radius: 4px;
              }

              .popover-menu-custom li:last-child {
                border-bottom-right-radius: 4px;
                border-bottom-left-radius: 4px;
              }
            `}
        </style>
        <div
          onClick={() => { this.toggleOpen(null); }}
          ref={(trigger) => {
            this.triggerRef = trigger;
          }}
        >
          {this.props.trigger}
        </div>
        <ul
          onClick={(event) => { this.closeIfOptionSelected(event); }}
          onMouseLeave={(event) => { this.close(); }}
          style={assign(
            {}, 
            STYLES.resetList,
            STYLES.menu,
            this.state.isOpen && STYLES.menuOpen,
            this.state.isOpen && this.getWrapperStyles(),
          )}
        >
          {this.props.children}
        </ul>
      </div>
    );
  }
}

Menu['defaultProps'] = {
  offset: {top: 0, left: 0},
};

export class SubMenu extends React.Component {
  state;
  props;

  constructor (props) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      isOpen: false,
      isHovered: false,
    };
  }

  open () {
    this.setState({isOpen: true, isHovered: true});
  }

  close () {
    this.setState({isOpen: false, isHovered: false});
  }

  render () {
    const {title, children} = this.props;

    return (
      <li
        className="submenu-li"
        style={assign(
          {},
          STYLES.menuItem,
          this.state.isHovered && STYLES.menuItemHovered,
        )}
        onMouseEnter={this.open}
        onMouseLeave={this.close}
      >
        {title}
        <div style={STYLES.carrot}>
          <DownCarrotSVG />
        </div>
        <ul
          className="submenu-ul"
          style={assign(
            {}, 
            STYLES.resetList,
            STYLES.menu,
            STYLES.subMenu,
            this.state.isOpen && STYLES.subMenuOpen,
          )}
        >
          {children}
        </ul>
      </li>
    );
  }
}

/* tslint:disable:variable-name */
export const MenuItem = ({children, data, disabled, onClick, style}) => {
  return (
    <li
      className={CLOSE_IF_SELECTED_CLASS}
      onClick={(event) => {
        if (!disabled) { onClick(event, data); }
      }}
      style={assign(
        {}, 
        STYLES.menuItem,
        disabled && STYLES.menuItemDisabled,
        style,
      )}
    >
      {children}
    </li>
  );
};
