import * as React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import {ComponentIconSVG, RepeaterIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import * as Color from 'color'

const DOUBLE_CLICK_WAIT_DELAY_MS = 100

export default class ComponentHeadingRowHeading extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.onExpandTimeout = null
    this.state = {
      isEditingRowTitle: false,
      rowTitle: props.row.element.getTitle()
    }
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.row.removeListener('update', this.handleUpdate)
    this.props.row.element.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.row.on('update', this.handleUpdate)
    this.props.row.element.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (
      what === 'row-hovered' ||
      what === 'row-unhovered' ||
      what === 'element-selected' ||
      what === 'element-unselected'
    ) {
      this.forceUpdate()
    } else if (what === 'row-set-title') {
      this.setState({
        rowTitle: this.props.row.element.getTitle()
      })
    }
  }

  handleRowTitleChange (event) {
    this.setState({
      rowTitle: event.target.value
    })
  }

  handleRowTitleKeyDown (event) {
    event.stopPropagation()
    // Submit on Enter
    if (event.which === 13) {
      this.persistRowTitle()
    }
  }

  persistRowTitle () {
    this.props.row.element.setTitle(this.state.rowTitle, {from: 'timeline'}, (err, rowTitle) => {
      if (err) {
        // ...
      }
      this.setState({
        rowTitle,
        isEditingRowTitle: false
      })
    })
  }

  getIcon () {
    if (this.props.row.element.isRepeater()) {
      return <RepeaterIconSVG />
    } else if (this.props.row.element.isComponent()) {
      return <ComponentIconSVG />
    }
    return ''
  }

  render () {
    let color = Palette.ROCK_MUTED

    if (this.props.row.isSelected()) {
      color = Palette.SUNSTONE
    } else if (this.props.row.isExpanded()) {
      color = Palette.ROCK
    }

    if (this.props.row.isHovered()) {
      color = Color(color).lighten(0.25)
    }

    return (
      (this.props.row.isRootRow())
        ? (<div
          className='component-heading-row-heading-root-box'
          title={this.state.rowTitle}
          style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
            height: 27,
            display: 'inline-block'
          } : {
            height: 27,
            display: 'inline-block',
            transform: 'translateY(1px)'
          })}>
          <span
            className='component-heading-row-heading-root-icon-box'
            style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
              marginLeft: 7,
              marginRight: 7,
              display: 'inline-block',
              transform: 'translateY(4px)'
            } : {
              marginRight: 4,
              display: 'inline-block',
              transform: 'translateY(4px)'
            })}>
            <ComponentIconSVG />
          </span>
          {trunc(this.state.rowTitle, 12)}
        </div>)
        : (<span
          className='component-heading-row-heading-child-box'
          title={this.state.rowTitle}
          style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
            color,
            display: 'flex',
            alignItems: 'center',
            height: 25,
            marginLeft: 5
          } : {
            color,
            position: 'relative',
            zIndex: 1005,
            marginLeft: 25,
            display: 'inline-block',
            width: 100,
            height: 20
          })}>
          <span
            className='component-heading-row-heading-child-icon-box'
            style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
              display: 'inline-block',
              marginTop: 5
            } : {
              position: 'absolute',
              display: 'inline-block',
              height: 20,
              left: 2,
              top: 8
            })}>
            {this.getIcon()}
          </span>
          <span
            style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
              display: 'inline-block',
              height: 20,
              marginLeft: (this.props.row.element.isComponent())
                  ? 5
                  : 0,
              overflowX: 'hidden',
              width: 160
            } : {
              position: 'absolute',
              display: 'inline-block',
              height: 20,
              left: (this.props.row.element.isComponent() || this.props.row.element.isRepeater())
                  ? 21
                  : 5,
              top: 7,
              overflowX: 'hidden',
              width: (this.props.row.element.isComponent() || this.props.row.element.isRepeater())
                ? 80
                : 100
            })}
            onClick={(clickEvent) => {
              if (!this.onExpandTimeout) {
                this.onExpandTimeout = setTimeout(this.props.onExpand, DOUBLE_CLICK_WAIT_DELAY_MS)
              }
            }}
            onDoubleClick={(clickEvent) => {
              clickEvent.stopPropagation()
              clearTimeout(this.onExpandTimeout)
              this.onExpandTimeout = null
              if (!this.state.isEditingRowTitle) {
                this.setState({isEditingRowTitle: true}, () => {
                  this.refs.rowTitleInput && this.refs.rowTitleInput.select()
                })
              }
            }}
          >
            {this.state.isEditingRowTitle
              ? <input
                style={{
                  color,
                  fontSize: 12,
                  fontFamily: 'Fira Sans'
                }}
                ref='rowTitleInput'
                type='text'
                value={this.state.rowTitle}
                onChange={(e) => this.handleRowTitleChange(e)}
                onKeyDown={(e) => this.handleRowTitleKeyDown(e)}
                onBlur={() => {
                  this.persistRowTitle()
                }}
              />
              : trunc(this.state.rowTitle, 8)
            }
          </span>
        </span>)
    )
  }
}

const trunc = (str, len) => {
  if (str.length <= len) {
    return str
  }

  return `${str.slice(0, len)}…`
}

ComponentHeadingRowHeading.propTypes = {
  row: React.PropTypes.object.isRequired,
  onExpand: React.PropTypes.func.isRequired
}
