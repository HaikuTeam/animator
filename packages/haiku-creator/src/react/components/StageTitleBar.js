import React from 'react'
import { shell, ipcRenderer } from 'electron'
import Radium from 'radium'
import Popover from 'react-popover'
import assign from 'lodash.assign'
import Palette from './Palette'
import { ThreeBounce } from 'better-react-spinkit'
import Color from 'color'
import { BTN_STYLES } from '../styles/btnShared'
import CopyToClipboard from 'react-copy-to-clipboard'
import ToolSelector from './ToolSelector'
import Toggle from './Toggle'
import {InteractionMode} from '@haiku/player/lib/helpers/interactionModes'
import {
  PublishSnapshotSVG,
  ConnectionIconSVG,
  // UndoIconSVG,
  // RedoIconSVG,
  WarningIconSVG,
  SuccessIconSVG,
  DangerIconSVG,
  CliboardIconSVG
} from './Icons'
import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'
import { ExporterFormat } from 'haiku-sdk-creator/lib/exporter'

var mixpanel = require('haiku-serialization/src/utils/Mixpanel')

const STYLES = {
  hide: {
    display: 'none'
  },
  frame: {
    backgroundColor: Palette.COAL,
    position: 'relative',
    top: 0,
    zIndex: 1,
    height: '36px',
    padding: '6px'
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  sharePopover: {
    position: 'absolute',
    top: 34,
    backgroundColor: Palette.FATHER_COAL,
    width: 204,
    padding: '13px 9px',
    fontSize: 17,
    color: Palette.ROCK,
    textAlign: 'center',
    borderRadius: 4,
    boxShadow: '0 6px 25px 0 ' + Palette.FATHER_COAL
  },
  popoverClose: {
    color: 'white',
    position: 'absolute',
    top: 5,
    right: 10,
    fontSize: 15,
    textTransform: 'lowercase'
  },
  footer: {
    backgroundColor: Color(Palette.DARK_GRAY).fade(0.7),
    height: 25,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    fontSize: 10,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    paddingTop: 5
  },
  time: {
    fontWeight: 'bold',
    marginLeft: 5
  },
  copy: {
    position: 'absolute',
    height: '100%',
    width: 25,
    right: 0,
    paddingTop: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.DARK_GRAY
  },
  copyLoading: {
    paddingTop: 0,
    paddingBottom: 6,
    pointerEvents: 'none'
  },
  linkHolster: {
    height: 29,
    position: 'relative',
    borderRadius: 3,
    marginTop: 3,
    cursor: 'pointer',
    backgroundColor: Color(Palette.DARK_GRAY).fade(0.68),
    border: '1px solid ' + Palette.DARK_GRAY

  },
  link: {
    fontSize: 10,
    color: Color(Palette.LIGHT_BLUE).lighten(0.37),
    position: 'absolute',
    left: 7,
    top: 7,
    cursor: 'pointer'
  },
  generatingLink: {
    color: Palette.ROCK,
    cursor: 'default',
    fontStyle: 'italic'
  },
  previewToggle: {
    float: 'right'
  }
}

const SNAPSHOT_SAVE_RESOLUTION_STRATEGIES = {
  normal: { strategy: 'recursive', favor: 'ours' },
  ours: { strategy: 'ours' },
  theirs: { strategy: 'theirs' }
}

class PopoverBody extends React.Component {
  shouldComponentUpdate (nextProps) {
    return (
      this.props.titleText !== nextProps.titleText ||
      this.props.linkAddress !== nextProps.linkAddress ||
      this.props.isSnapshotSaveInProgress !== nextProps.isSnapshotSaveInProgress ||
      this.props.snapshotSaveConfirmed !== nextProps.snapshotSaveConfirmed ||
      this.props.isProjectInfoFetchInProgress !== nextProps.isProjectInfoFetchInProgress
    )
  }

  render () {
    let popoverPosition

    if (this.props.snapshotSaveConfirmed) {
      popoverPosition = -72
    } else if (this.props.isSnapshotSaveInProgress) {
      popoverPosition = -70
    } else {
      popoverPosition = -59
    }

    return (
      <div style={[STYLES.sharePopover, {right: popoverPosition}]}>
        <button style={STYLES.popoverClose} onClick={this.props.close}>x</button>
        {this.props.titleText}
        <div style={STYLES.linkHolster}>
          {(this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress)
            ? <span style={[STYLES.link, STYLES.generatingLink]}>Updating Share Page</span>
            : <span style={STYLES.link} onClick={() => shell.openExternal(this.props.linkAddress)}>{this.props.linkAddress.substring(0, 33)}</span>}
          <CopyToClipboard
            text={this.props.linkAddress}
            onCopy={() => {
              this.props.parent.setState({copied: true})
              this.props.parent.setState({showCopied: true}, () => {
                setTimeout(() => {
                  this.props.parent.setState({showCopied: false})
                }, 1900)
              })
            }}>
            {(this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress)
              ? <span style={[STYLES.copy, STYLES.copyLoading]}><ThreeBounce size={3} color={Palette.ROCK} /></span>
              : <span style={STYLES.copy}><CliboardIconSVG /></span>}
          </CopyToClipboard>
        </div>
        {/* todo: show last updated? <div style={STYLES.footer}>UPDATED<span style={STYLES.time}>{'9:00am Jun 15, 2017'}</span></div> */}
      </div>
    )
  }
}

const PopoverBodyRadiumized = Radium(PopoverBody)

class StageTitleBar extends React.Component {
  constructor (props) {
    super(props)
    this.handleConnectionClick = this.handleConnectionClick.bind(this)
    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.handleRedoClick = this.handleRedoClick.bind(this)
    this.handleSaveSnapshotClick = this.handleSaveSnapshotClick.bind(this)
    this.handleMergeResolveOurs = this.handleMergeResolveOurs.bind(this)
    this.handleMergeResolveTheirs = this.handleMergeResolveTheirs.bind(this)
    this._isMounted = false
    this.state = {
      snapshotSaveResolutionStrategyName: 'normal',
      isSnapshotSaveInProgress: false,
      snapshotMergeConflicts: null,
      snapshotSaveConfirmed: null,
      snapshotSaveError: null,
      showSharePopover: false,
      copied: false,
      linkAddress: 'Fetching Info',
      showCopied: false,
      projectInfoFetchError: null,
      isProjectInfoFetchInProgress: false,
      projectInfo: null,
      gitUndoables: [],
      gitRedoables: []
    }
  }

  componentWillMount () {
    this._isMounted = true
  }

  componentDidMount () {
    this.performProjectInfoFetch()

    // It's kind of weird to have this heartbeat logic buried all the way down here inside StateTitleBar;
    // it probably should be moved up to the Creator level so it's easier to find #FIXME
    this._fetchMasterStateInterval = setInterval(() => {
      return this.props.websocket.request({ method: 'masterHeartbeat', params: [this.props.folder] }, (heartbeatErr, masterState) => {
        if (heartbeatErr || !masterState) {
          // If master disconnects we might not even get an error, so create a fake error in its place
          if (!heartbeatErr) heartbeatErr = new Error('Unknown problem with master heartbeat')
          console.error(heartbeatErr)

          // If master has disconnected, stop running this interval so we don't get pulsing error messages
          clearInterval(this._fetchMasterStateInterval)

          // But the first time we get this, display a user notice - they probably need to restart Haiku to get
          // into a better state, at least until we can resolve what the cause of this problem is
          return this.props.createNotice({
            type: 'danger',
            title: 'Uh oh!',
            message: 'Haiku is having a problem accessing your project. 😢 Please restart Haiku. If you see this error again, contact Haiku for support.'
          })
        }

        ipcRenderer.send('master:heartbeat', assign({}, masterState))

        if (this._isMounted) {
          this.setState({
            gitUndoables: masterState.gitUndoables,
            gitRedoables: masterState.gitRedoables
          })
        }
      })
    }, 1000)

    ipcRenderer.on('global-menu:save', () => {
      this.handleSaveSnapshotClick()
    })
  }

  componentWillUnmount () {
    this._isMounted = false
    clearInterval(this._fetchMasterStateInterval)
  }

  handleConnectionClick () {
    // TODO
  }

  handleUndoClick () {
    return this.props.websocket.request({ method: 'gitUndo', params: [this.props.folder, { type: 'global' }] }, (err) => {
      if (err) {
        console.error(err)
        return this.props.createNotice({
          type: 'warning',
          title: 'Uh oh!',
          message: 'We were unable to undo your last action. 😢 Please contact Haiku for support.'
        })
      }
    })
  }

  handleRedoClick () {
    return this.props.websocket.request({ method: 'gitRedo', params: [this.props.folder, { type: 'global' }] }, (err) => {
      if (err) {
        console.error(err)
        return this.props.createNotice({
          type: 'warning',
          title: 'Uh oh!',
          message: 'We were unable to redo your last action. 😢 Please contact Haiku for support.'
        })
      }
    })
  }

  getProjectSaveOptions () {
    return {
      commitMessage: 'Changes saved (via Haiku Desktop)',
      saveStrategy: SNAPSHOT_SAVE_RESOLUTION_STRATEGIES[this.state.snapshotSaveResolutionStrategyName],
      exporterFormats: experimentIsEnabled(Experiment.LottieExportOnPublish) ? [ExporterFormat.Bodymovin] : []
    }
  }

  handleSaveSnapshotClick () {
    if (this.state.snapshotSaveError) return void (0)
    if (this.state.isSnapshotSaveInProgress) return void (0)
    if (this.state.snapshotMergeConflicts) return void (0)
    if (this.state.showSharePopover) return void (0)

    this.setState({showSharePopover: !this.state.showSharePopover})

    if (this.props.tourClient) this.props.tourClient.next()

    return this.performProjectSave()
  }

  performProjectInfoFetch () {
    this.setState({ isProjectInfoFetchInProgress: true })
    return this.props.websocket.request({ method: 'fetchProjectInfo', params: [this.props.folder, this.props.project.projectName, this.props.username, this.props.password, {}] }, (projectInfoFetchError, projectInfo) => {
      this.setState({ isProjectInfoFetchInProgress: false })

      if (projectInfoFetchError) {
        if (projectInfoFetchError.message) {
          console.error(projectInfoFetchError.message)
        } else {
          console.error('unknown problem fetching project')
        }

        // We might only care about this if it comes up during a save... #FIXME ??
        if (projectInfoFetchError.message === 'Timed out waiting for project share info') {
          // ?
          return void (0) // Gotta return here - don't want to fall through as though we actually got projectInfo below
        } else {
          return this.setState({ projectInfoFetchError })
        }
      }

      this.setState({ projectInfo })
      if (this.props.receiveProjectInfo) this.props.receiveProjectInfo(projectInfo)
      if (projectInfo.shareLink) this.setState({ linkAddress: projectInfo.shareLink })
    })
  }

  withProjectInfo (otherObject) {
    let proj = this.state.projectInfo || {}
    return assign({}, otherObject, {
      organization: proj.organizationName,
      uuid: proj.projectUid,
      sha: proj.sha,
      branch: proj.branchName
    })
  }

  requestSaveProject (cb) {
    return this.props.websocket.request({ method: 'saveProject', params: [this.props.folder, this.props.project.projectName, this.props.username, this.props.password, this.getProjectSaveOptions()] }, cb)
  }

  performProjectSave () {
    mixpanel.haikuTrack('creator:project:saving', this.withProjectInfo({
      username: this.props.username,
      project: this.props.projectName
    }))
    this.setState({ isSnapshotSaveInProgress: true })

    return this.requestSaveProject((snapshotSaveError, snapshotData) => {
      if (snapshotSaveError) {
        console.error(snapshotSaveError)
        if (snapshotSaveError.message === 'Timed out waiting for project share info') {
          this.props.createNotice({
            type: 'warning',
            title: 'Hmm...',
            message: 'Publishing your project seems to be taking a long time. 😢 Please try again in a few moments. If you see this message again, contact Haiku for support.'
          })
        } else {
          this.props.createNotice({
            type: 'danger',
            title: 'Oh no!',
            message: 'We were unable to publish your project. 😢 Please try again in a few moments. If you still see this error, contact Haiku for support.'
          })
        }
        return this.setState({ isSnapshotSaveInProgress: false, snapshotSaveResolutionStrategyName: 'normal', snapshotSaveError }, () => {
          return setTimeout(() => this.setState({ snapshotSaveError: null }), 2000)
        })
      }

      this.setState({ isSnapshotSaveInProgress: false, snapshotSaveConfirmed: true })

      if (snapshotData) {
        if (snapshotData.conflicts) {
          console.warn('[creator] Merge conflicts found!')
          this.props.createNotice({
            type: 'warning',
            title: 'Merge conflicts!',
            message: 'We couldn\'t merge your changes. 😢 You\'ll need to decide how to merge your changes before continuing.'
          })
          return this.setState({
            snapshotMergeConflicts: snapshotData.conflicts,
            showSharePopover: false
          })
        }

        console.info('[creator] Save complete', snapshotData)

        // Unless we set back to normal, subsequent saves will still be set to use the strict ours/theirs strategy,
        // which will clobber updates that we might want to actually merge gracefully.
        this.setState({ snapshotSaveResolutionStrategyName: 'normal' })

        if (snapshotData.shareLink) {
          this.setState({ linkAddress: snapshotData.shareLink })
        }

        mixpanel.haikuTrack('creator:project:saved', this.withProjectInfo({
          username: this.props.username,
          project: this.props.projectName
        }))
      }

      return setTimeout(() => this.setState({ snapshotSaveConfirmed: false }), 2000)
    })
  }

  renderSnapshotSaveInnerButton () {
    if (this.state.snapshotSaveError) return <div style={{height: 18, marginRight: -5}}><DangerIconSVG fill='transparent' /></div>
    if (this.state.snapshotMergeConflicts) return <div style={{height: 19, marginRight: 0, marginTop: -2}}><WarningIconSVG fill='transparent' color={Palette.ORANGE} /></div>
    if (this.state.snapshotSaveConfirmed) return <div style={{ height: 18 }}><SuccessIconSVG viewBox='0 0 14 14' fill='transparent' /></div>
    return <PublishSnapshotSVG />
  }

  handleMergeResolveOurs () {
    this.setState({ snapshotMergeConflicts: null, snapshotSaveResolutionStrategyName: 'ours' }, () => {
      return this.performProjectSave()
    })
  }

  handleMergeResolveTheirs () {
    this.setState({ snapshotMergeConflicts: null, snapshotSaveResolutionStrategyName: 'theirs' }, () => {
      return this.performProjectSave()
    })
  }

  renderMergeConflictResolutionArea () {
    if (!this.state.snapshotMergeConflicts) return ''
    return (
      <div style={{ position: 'absolute', left: 0, right: 150, top: 4, padding: 5, borderRadius: 4, color: Palette.ROCK, textAlign: 'right', overflow: 'hidden' }}>
        Conflict found!{' '}
        <a onClick={this.handleMergeResolveOurs} style={{ cursor: 'pointer', textDecoration: 'underline', color: Palette.GREEN }}>Force your changes</a>{' '}
        or <a onClick={this.handleMergeResolveTheirs} style={{ cursor: 'pointer', textDecoration: 'underline', color: Palette.RED }}>discard yours &amp; accept theirs</a>?
      </div>
    )
  }

  hoverStyleForSaveButton () {
    if (this.state.isSnapshotSaveInProgress) return null
    if (this.state.snapshotSaveError) return null
    if (this.state.snapshotMergeConflicts) return null
    if (this.state.snapshotSaveConfirmed) return null
    return BTN_STYLES.btnIconHover
  }

  togglePreviewMode (checked) {
    const interaction = checked ? InteractionMode.EDIT : InteractionMode.LIVE

    this.props.websocket.action(
      'setInteractionMode',
      [this.props.folder, interaction],
      () => {}
    )

    if (this.props.onPreviewModeToggled) {
      this.props.onPreviewModeToggled(interaction)
    }
  }

  render () {
    const { showSharePopover } = this.state
    const titleText = this.state.showCopied
      ? 'Copied'
      : 'Share & Embed'

    let btnText = 'PUBLISH'
    if (this.state.snapshotSaveConfirmed) btnText = 'PUBLISHED'
    if (this.state.isSnapshotSaveInProgress) btnText = 'PUBLISHING'

    return (
      <div style={STYLES.frame} className='frame'>
        <Popover
          place='below'
          isOpen={showSharePopover}
          style={{zIndex: 2}}
          className='publish-popover'
          body={
            <PopoverBodyRadiumized
              parent={this}
              titleText={titleText}
              snapshotSaveConfirmed={this.state.snapshotSaveConfirmed}
              isSnapshotSaveInProgress={this.state.isSnapshotSaveInProgress}
              isProjectInfoFetchInProgress={this.state.isProjectInfoFetchInProgress}
              linkAddress={this.state.linkAddress}
              close={() => this.setState({ showSharePopover: false })} />
          }>
          <button key='save'
            id='publish'
            onClick={this.handleSaveSnapshotClick}
            style={[
              BTN_STYLES.btnText,
              BTN_STYLES.rightBtns,
              this.state.isSnapshotSaveInProgress && STYLES.disabled
            ]}>
            {this.renderSnapshotSaveInnerButton()}<span style={{marginLeft: 7}}>{btnText}</span>
          </button>
        </Popover>

        {
          experimentIsEnabled(Experiment.PreviewMode) &&
          <Toggle
            onToggle={this.togglePreviewMode.bind(this)}
            style={STYLES.previewToggle}
          />
        }

        {this.renderMergeConflictResolutionArea()}
        <button onClick={this.handleConnectionClick} style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHover, STYLES.hide]} key='connect'>
          <ConnectionIconSVG />
        </button>

        { false &&
          <ToolSelector websocket={this.props.websocket} />
        }

      </div>
    )
  }
}

StageTitleBar.propTypes = {
  folder: React.PropTypes.string.isRequired,
  projectName: React.PropTypes.string,
  username: React.PropTypes.string,
  password: React.PropTypes.string,
  websocket: React.PropTypes.object.isRequired,
  createNotice: React.PropTypes.func.isRequired,
  removeNotice: React.PropTypes.func.isRequired,
  receiveProjectInfo: React.PropTypes.func
}

export default Radium(StageTitleBar)
