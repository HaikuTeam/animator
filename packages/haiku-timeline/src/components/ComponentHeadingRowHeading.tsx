import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import {ComponentIconSVG, RepeaterIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import * as React from 'react';

export interface ComponentHeadingRowHeadingProps {
  row: any;
  onExpand (clickEvent: React.MouseEvent<any>): void;
  setEditingRowTitleStatus (isEditingRowTitle: boolean): void;
}

const DOUBLE_CLICK_WAIT_DELAY_MS = 100;

export default class ComponentHeadingRowHeading extends React.Component<ComponentHeadingRowHeadingProps> {
  private onExpandTimeout: number;
  private mounted = false;
  private rowTitleInput: HTMLInputElement;

  state = {
    isEditingRowTitle: false,
    rowTitle: this.props.row.element.getTitle(),
  };

  componentWillUnmount () {
    this.mounted = false;
    this.props.row.removeListener('update', this.handleUpdate);
    this.props.row.element.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.row.on('update', this.handleUpdate);
    this.props.row.element.on('update', this.handleUpdate);
  }

  handleUpdate = (what: string): void => {
    if (!this.mounted) {
      return null;
    }
    if (
      what === 'row-hovered' ||
      what === 'row-unhovered' ||
      what === 'element-selected' ||
      what === 'element-unselected' ||
      what === 'keyframe-create'
    ) {
      this.forceUpdate();
    } else if (what === 'row-set-title') {
      this.setState({
        rowTitle: this.props.row.element.getTitle(),
      });
    }
  };

  handleRowTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      rowTitle: event.target.value,
    });
  };

  handleRowTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    // Submit on Enter
    if (event.which === 13) {
      this.persistRowTitle();
    }
  };

  persistRowTitle = () => {
    this.props.row.element.setTitle(this.state.rowTitle, {from: 'timeline'}, (err: Error, rowTitle: string) => {
      if (err) {
        // ...
      }
      this.props.setEditingRowTitleStatus(false);
      this.setState({
        rowTitle,
        isEditingRowTitle: false,
      });
    });
  };

  getIcon () {
    if (this.props.row.element.isRepeater()) {
      return <RepeaterIconSVG />;
    }

    if (this.props.row.element.isComponent()) {
      return <ComponentIconSVG />;
    }

    return '';
  }

  hasIcon () {
    return this.props.row.element.isRepeater() || this.props.row.element.isComponent();
  }

  expand = (clickEvent: React.MouseEvent<any>) => {
    if (!this.onExpandTimeout) {
      this.onExpandTimeout = window.setTimeout(this.props.onExpand, DOUBLE_CLICK_WAIT_DELAY_MS);
    }
  };

  editName = (clickEvent: React.MouseEvent<any>) => {
    clickEvent.stopPropagation();
    clearTimeout(this.onExpandTimeout);
    this.onExpandTimeout = null;
    if (!this.state.isEditingRowTitle) {
      this.props.setEditingRowTitleStatus(true);
      this.setState({isEditingRowTitle: true}, () => {
        if (this.refs.rowTitleInput) {
          this.rowTitleInput.select();
        }
      });
    }
  };

  setRowTitleInputRef = (rowTitleInput: HTMLInputElement) => {
    this.rowTitleInput = rowTitleInput;
  };

  render () {
    let color = Palette.ROCK_MUTED;

    if (this.props.row.isSelected()) {
      color = Palette.SUNSTONE;
    } else if (this.props.row.isExpanded()) {
      color = Palette.ROCK;
    }

    if (this.props.row.isHovered()) {
      color = Color(color).lighten(0.25).toString();
    }

    return this.props.row.isRootRow() ? (
      <div
        className="component-heading-row-heading-root-box js-avoid-marquee-init"
        style={{
          display: 'inline-block',
          transform: 'translateY(1px)',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          className="component-heading-row-heading-root-icon-box"
          style={{
            marginLeft: 8,
            marginRight: 4,
            display: 'inline-block',
            verticalAlign: 'sub',
          }}
        >
          <ComponentIconSVG />
        </span>
        {this.state.rowTitle}
      </div>
    ) : (
      <span
        className="component-heading-row-heading-child-box"
        style={{
          color,
          display: 'flex',
          alignItems: 'center',
          height: 25,
          marginLeft: 5,
          width: '88%',
        }}
      >
        <span
          className="component-heading-row-heading-child-icon-box"
          style={{
            display: 'inline-block',
            marginTop: 5,
          }}
        >
          {this.getIcon()}
        </span>
        <span
          className="js-avoid-marquee-init"
          style={{
            display: 'inline-block',
            height: 20,
            marginLeft: this.hasIcon() ? 5 : 0,
            overflowX: 'hidden',
            width: '100%',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          onClick={this.expand}
          onDoubleClick={this.editName}
        >
          {this.state.isEditingRowTitle ? (
            <input
              style={{
                color,
                fontSize: 12,
                fontFamily: 'Fira Sans',
              }}
              ref={this.setRowTitleInputRef}
              type="text"
              value={this.state.rowTitle}
              onChange={this.handleRowTitleChange}
              onKeyDown={this.handleRowTitleKeyDown}
              onBlur={this.persistRowTitle}
            />
          ) : (
            this.state.rowTitle
          )}
        </span>
      </span>
    );
  }
}
