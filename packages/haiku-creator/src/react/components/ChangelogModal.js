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
import * as changelog from '../../../../../changelog/public/latest.json'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLES = {
  modalWrapper: {
    maxWidth: '540px'
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
  render () {
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
              .changelog a {
                color: ${Palette.SUNSTONE};
              }

              .changelog p {
                margin: 0;
              }
            `}
          </style>

          <div className='changelog' onClick={(e) => {
            if (e.target.href) {
              e.preventDefault()
              shell.openExternal(e.target.href)
            }
          }}>
            {changelog.sections.map((section) => {
              return (
                <div key={section.title}>
                  <h3 style={STYLES.sectionTitle}>{section.title}</h3>
                  <ul style={STYLES.list}>
                    {section.entries.map((entry, idx) => {
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
            })}
          </div>
        </div>

        <ModalFooter>
          <button style={STYLES.button} onClick={this.props.onClose}>Done</button>
        </ModalFooter>
      </ModalWrapper>
    )
  }
}

ChangelogModal.propTypes = {
  onClose: React.PropTypes.func.isRequired
}

export default ChangelogModal
