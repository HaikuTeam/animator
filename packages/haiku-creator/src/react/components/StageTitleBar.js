import React from 'react'
import ReactDOM from 'react-dom'
import { shell, ipcRenderer } from 'electron'
import Radium from 'radium'
import Popover from 'react-popover'
import assign from 'lodash.assign'
import Palette from 'haiku-ui-common/lib/Palette'
import { ThreeBounce } from 'better-react-spinkit'
import Color from 'color'
import { BTN_STYLES } from '../styles/btnShared'
import CopyToClipboard from 'react-copy-to-clipboard'
import Toggle from './Toggle'
import {ShareModal} from 'haiku-ui-common/lib/react/ShareModal'
import {
  PublishSnapshotSVG,
  ConnectionIconSVG,
  WarningIconSVG,
  DangerIconSVG,
  CliboardIconSVG
} from 'haiku-ui-common/lib/react/OtherIcons'
import { ExporterFormat } from 'haiku-sdk-creator/lib/exporter'
import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'

var mixpanel = require('haiku-serialization/src/utils/Mixpanel')

const STYLES = {
  hide: {
    display: 'none'
  },
  frame: {
    backgroundColor: Palette.COAL,
    position: 'relative',
    top: 0,
    height: '36px',
    padding: '6px'
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none'
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
  },
  popupNotice: {
    display: 'inline-block',
    marginTop: '10px',
    fontSize: '13px',
    fontStyle: 'oblique'
  },
  link2: {
    color: Palette.LIGHT_BLUE,
    cursor: 'pointer'
  }
}

const SNAPSHOT_SAVE_RESOLUTION_STRATEGIES = {
  normal: { strategy: 'recursive', favor: 'ours' },
  ours: { strategy: 'ours' },
  theirs: { strategy: 'theirs' }
}

const MAX_SYNDICATION_CHECKS = 48
const SYNDICATION_CHECK_INTERVAL = 2500

class PopoverBody extends React.Component {
  shouldComponentUpdate (nextProps) {
    return (
      this.props.titleText !== nextProps.titleText ||
      this.props.linkAddress !== nextProps.linkAddress ||
      this.props.isSnapshotSaveInProgress !== nextProps.isSnapshotSaveInProgress ||
      this.props.snapshotSaveConfirmed !== nextProps.snapshotSaveConfirmed
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
          {this.props.isSnapshotSaveInProgress
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
            {(this.props.isSnapshotSaveInProgress)
              ? <span style={[STYLES.copy, STYLES.copyLoading]}><ThreeBounce size={3} color={Palette.ROCK} /></span>
              : <span style={STYLES.copy}><CliboardIconSVG /></span>}
          </CopyToClipboard>
        </div>
        <span style={STYLES.popupNotice}>Anyone with the link can <strong>view &amp; embed</strong> your project.</span>
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
      semverVersion: '0.0.0',
      showCopied: false,
      projectInfo: {},
      snapshotSyndicated: true,
      snapshotPublished: true
    }

    ipcRenderer.on('global-menu:show-project-location-toast', () => {
      if (!this._isMounted) {
        return
      }

      const noticeNotice = this.props.createNotice({
        type: 'info',
        title: 'Snapshot saved',
        message: (
          <p>
            <span
              style={STYLES.link2}
              onClick={() => {
                shell.showItemInFolder(this.props.folder)
              }}
            >
              View in Finder
            </span>
          </p>
        )
      })

      window.setTimeout(() => {
        this.props.removeNotice(undefined, noticeNotice.id)
      }, 2500)
    })

    ipcRenderer.on('global-menu:save', () => {
      if (!this._isMounted) {
        return
      }

      this.handleSaveSnapshotClick()
    })
  }

  componentDidMount () {
    this._isMounted = true

    // It's kind of weird to have this heartbeat logic buried all the way down here inside StateTitleBar;
    // it probably should be moved up to the Creator level so it's easier to find #FIXME
    this._fetchMasterStateInterval = setInterval(() => {
      if (this.props.projectModel) {
        return this.props.projectModel.masterHeartbeat((heartbeatErr, masterState) => {
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
        })
      }
    }, 1000)

    document.addEventListener('mouseup', (e) => {
      if (this._shareModal && this.state.showSharePopover) {
        const node = ReactDOM.findDOMNode(this._shareModal)
        const pnode = ReactDOM.findDOMNode(this)
        if (!node.contains(e.target) && !pnode.contains(e.target)) {
          this.setState({
            showSharePopover: false,
            isSnapshotSaveInProgress: false,
            snapshotSyndicated: true,
            snapshotPublished: true
          })
          this.clearSyndicationChecks()
        }
      }
    })
  }

  componentWillUnmount () {
    this._isMounted = false
    clearInterval(this._fetchMasterStateInterval)
    this.clearSyndicationChecks()
  }

  handleConnectionClick () {
    // TODO
  }

  getProjectSaveOptions () {
    return {
      commitMessage: 'Changes saved (via Haiku Desktop)',
      saveStrategy: SNAPSHOT_SAVE_RESOLUTION_STRATEGIES[this.state.snapshotSaveResolutionStrategyName],
      exporterFormats: [ExporterFormat.Bodymovin, ExporterFormat.HaikuStatic]
    }
  }

  handleSaveSnapshotClick () {
    if (this.state.snapshotSaveError) return void (0)
    if (this.state.isSnapshotSaveInProgress) return void (0)
    if (this.state.snapshotMergeConflicts) return void (0)

    this.setState({showSharePopover: true})

    mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'show-all-options'
    })

    return this.performProjectSave()
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
    if (this.props.projectModel) {
      return this.props.projectModel.saveProject(this.props.project.projectName, this.props.username, this.props.password, this.getProjectSaveOptions(), cb)
    }
  }

  clearSyndicationChecks () {
    clearInterval(this._performSyndicationCheckInterval)
  }

  performSyndicationCheck () {
    this.syndicationChecks++
    if (this.props.projectModel) {
      return this.props.projectModel.requestSyndicationInfo((err, info) => {
        if (err || !info || info.status.errored) {
          this.props.createNotice({
            type: 'danger',
            title: 'Uh oh!',
            message: 'We were unable to publish your project. 😢 Please try again in a bit. If you see this error again, contact Haiku for support.'
          })
          this.clearSyndicationChecks()
          return this.setState({
            showSharePopover: false,
            isSnapshotSaveInProgress: false,
            snapshotSyndicated: undefined,
            snapshotPublished: undefined
          })
        }

        // Avoid races with button display while aborting publish by only setting values that have become true.
        const newState = {
          projectInfo: info
        }

        if (info.status.syndicated) {
          newState.snapshotSyndicated = true
        }

        if (info.status.published) {
          newState.snapshotPublished = true
        }

        this.setState(newState)

        if ((info.status.syndicated && info.status.published) || this.syndicationChecks >= MAX_SYNDICATION_CHECKS) {
          this.clearSyndicationChecks()
        }

        if (this.syndicationChecks >= MAX_SYNDICATION_CHECKS && (!info.status.syndicated || !info.status.published)) {
          // If we timed out without noting syndication or publication, set these values to `undefined` so we can lower
          // expectations in the downstream UI.
          this.setState({
            snapshotSyndicated: info.status.syndicated || undefined,
            snapshotPublished: info.status.published || undefined
          })
        }
      })
    }
  }

  performProjectSave () {
    mixpanel.haikuTrack('creator:project:saving', this.withProjectInfo({
      username: this.props.username,
      project: this.props.projectName
    }))
    this.setState({ isSnapshotSaveInProgress: true, snapshotSyndicated: false, snapshotPublished: false })

    return this.requestSaveProject((snapshotSaveError, snapshotData) => {
      // If we aborted early, don't start polling.
      if (!this.state.showSharePopover) {
        return
      }

      if (snapshotSaveError) {
        console.error(snapshotSaveError)
        return this.setState({ isSnapshotSaveInProgress: false, snapshotSaveResolutionStrategyName: 'normal', snapshotSaveError }, () => {
          return setTimeout(() => this.setState({ snapshotSaveError: null }), 2000)
        })
      }

      this.setState({
        isSnapshotSaveInProgress: false,
        snapshotSaveConfirmed: true,
        projectInfo: snapshotData
      })

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

        if (snapshotData.semverVersion) {
          this.setState({ semverVersion: snapshotData.semverVersion })
        }

        if (snapshotData.status && snapshotData.status.published) {
          this.setState({ snapshotPublished: true })
        }

        if (snapshotData.status && snapshotData.status.syndicated) {
          this.setState({ snapshotSyndicated: true })
        } else {
          this.syndicationChecks = 0
          this._performSyndicationCheckInterval = setInterval(() => {
            this.performSyndicationCheck()
          }, SYNDICATION_CHECK_INTERVAL)
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

  render () {
    const { showSharePopover } = this.state
    const titleText = this.state.showCopied
      ? 'Copied'
      : 'Share & Embed'
    const projectInfo = this.withProjectInfo({})

    let btnText = 'PUBLISH'
    if (this.state.snapshotSyndicated === false || this.state.snapshotPublished === false) {
      btnText = 'PUBLISHING'
    }

    return (
      <div style={STYLES.frame} className='frame'>
        {experimentIsEnabled(Experiment.NewPublishUI)
          ? (
            <button key='save'
              id='publish'
              onClick={this.handleSaveSnapshotClick}
              disabled={!this.props.isTimelineReady && this.state.snapshotSyndicated === false}
              style={[
                BTN_STYLES.btnText,
                BTN_STYLES.rightBtns,
                this.state.snapshotSyndicated === false && STYLES.disabled,
                !this.props.isTimelineReady && STYLES.disabled
              ]}
            >
              {this.renderSnapshotSaveInnerButton()}<span style={{marginLeft: 7}}>{btnText}</span>
            </button>
          ) : (
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
          )
        }

        <Toggle
          onToggle={this.props.onPreviewModeToggled}
          style={STYLES.previewToggle}
          disabled={!this.props.isTimelineReady}
          active={this.props.isPreviewMode}
        />

        {this.renderMergeConflictResolutionArea()}
        <button onClick={this.handleConnectionClick} style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHover, STYLES.hide]} key='connect'>
          <ConnectionIconSVG />
        </button>

        {experimentIsEnabled(Experiment.NewPublishUI) && this.state.showSharePopover && !this.props.isPreviewMode &&
          <ShareModal
            project={this.props.project}
            snapshotSaveConfirmed={this.state.snapshotSaveConfirmed}
            isSnapshotSaveInProgress={this.state.isSnapshotSaveInProgress}
            linkAddress={this.state.linkAddress}
            semverVersion={this.state.semverVersion}
            error={this.state.snapshotSaveError}
            snapshotSyndicated={this.state.snapshotSyndicated}
            snapshotPublished={this.state.snapshotPublished}
            userName={this.props.username}
            organizationName={this.props.organizationName}
            ref={(el) => { this._shareModal = el }}
            projectUid={projectInfo.uuid}
            sha={projectInfo.sha}
            mixpanel={mixpanel}
            onProjectPublicChange={this.props.onProjectPublicChange}
          />
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
  organizationName: React.PropTypes.string,
  websocket: React.PropTypes.object.isRequired,
  createNotice: React.PropTypes.func.isRequired,
  removeNotice: React.PropTypes.func.isRequired,
  receiveProjectInfo: React.PropTypes.func
}

export default Radium(StageTitleBar)
