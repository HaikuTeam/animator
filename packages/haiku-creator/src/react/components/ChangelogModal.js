import React from 'react'
import marked from 'marked'
import {shell} from 'electron'
import {
  ModalWrapper,
  ModalHeader,
  ModalFooter
} from 'haiku-ui-common/lib/react/Modal'
import {LogoMicroSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import {BTN_STYLES} from '../styles/btnShared'
import Palette from 'haiku-ui-common/lib/Palette'
import {PrettyScroll} from 'haiku-ui-common/lib/react/PrettyScroll'
import Changelog from 'haiku-serialization/src/bll/Changelog'

const STYLES = {
  modalWrapper: {
    maxWidth: '540px',
    zIndex: '9002'
  },
  modalContent: {
    padding: '20px 40px 60px'
  },
  iconStyle: {
    marginRight: '8px'
  },
  button: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.btnBlack
  },
  version: {
    fontSize: '30px'
  },
  date: {
    fontSize: '11px'
  },
  logoAndVersion: {
    display: 'flex',
    alignItems: 'center'
  },
  sectionTitle: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: '15px'
  },
  list: {
    paddingLeft: '30px',
    fontSize: '13px'
  }
}

class ChangelogModal extends React.PureComponent {
  constructor (props) {
    super()
    this.changelogManager = new Changelog(props.lastViewedChangelog)
    this.state = {
      changelog: null
    }
  }

  async componentDidMount () {
    const changelog = await this.changelogManager.getChangelog()
    this.setState({changelog})
  }

  renderSections (changelog) {
    const result = []
    for (let section in changelog.sections) {
      result.push(
        <div key={section}>
          <h3 style={STYLES.sectionTitle}>{section}</h3>
          <ul style={STYLES.list}>
            {changelog.sections[section].map((entry, idx) => {
              return (
                <li
                  key={idx}
                  dangerouslySetInnerHTML={{__html: marked(entry)}}
                />
              )
            })}
          </ul>
        </div>
      )
    }
    return result
  }

  render () {
    const changelog = this.state.changelog
    if (!changelog) {
      return null
    }
    return (
      <ModalWrapper style={STYLES.modalWrapper}>
        <ModalHeader>
          <h2>
            <i>Release Notes</i>
          </h2>
        </ModalHeader>

        <div style={STYLES.modalContent}>
          <div>
            <div style={STYLES.logoAndVersion}>
              <LogoMicroSVG style={STYLES.iconStyle} size={24} />
              <span style={STYLES.version}>{changelog.version}</span>
            </div>
            <time style={STYLES.date}>{changelog.date}</time>
          </div>

          {/* Shamefully dirty, but we need to style the content coming from
            the changelog, which is dynamic */}
          <style>
            {`
              .changelog {
                max-height: 350px;
                overflow: auto;
              }

              .changelog a {
                color: ${Palette.SUNSTONE};
              }

              .changelog p {
                margin: 0;
              }
            `}
          </style>

          <PrettyScroll>
            <div
              className='changelog'
              onClick={(e) => {
                if (e.target.href) {
                  e.preventDefault()
                  shell.openExternal(e.target.href)
                }
              }}
            >
              {this.renderSections(changelog)}
            </div>
          </PrettyScroll>
        </div>

        <ModalFooter>
          <button style={STYLES.button} onClick={this.props.onClose}>
            Done
          </button>
        </ModalFooter>
      </ModalWrapper>
    )
  }
}

ChangelogModal.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  lastViewedChangelog: React.PropTypes.string
}

export default ChangelogModal
