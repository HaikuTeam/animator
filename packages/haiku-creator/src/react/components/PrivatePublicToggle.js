import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import { ExternalLink } from 'haiku-ui-common/lib/react/ExternalLink'

const STYLES = {
  disabledForm: {
    opacity: 0.5
  },
  field: {
    width: 500,
    margin: '20px 0 0 3px'
  },
  label: {
    textTransform: 'uppercase',
    fontSize: 17,
    marginLeft: 7,
    color: Palette.SUNSTONE
  },
  input: {
    transform: 'translateY(-2px)'
  },
  description: {
    marginTop: 5,
    marginLeft: 20
  },
  link: {
    color: Palette.LIGHT_BLUE,
    cursor: 'pointer'
  }
}

class PrivatePublicToggle extends React.PureComponent {
  render () {
    const {isPublic, onChange} = this.props

    return (
      <form style={this.props.isDisabled ? STYLES.disabledForm : STYLES.toggleLabel}>
        <label style={STYLES.field}>
          <input type='radio' value='public' onChange={() => { onChange(!isPublic) }} checked={isPublic} style={STYLES.input} />
          <span style={STYLES.label}>Public</span>
          <div style={STYLES.description}>
          Visible on the <ExternalLink style={STYLES.link} href={`https://share.haiku.ai/`}>Haiku Community</ExternalLink>, 
          and able to be <ExternalLink style={STYLES.link} href={`https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html#forking`}>forked</ExternalLink>.
          </div>
        </label>
        <label style={STYLES.field}>
          <input type='radio' value='private' onChange={() => { onChange(!isPublic) }} checked={!isPublic} style={STYLES.input} />
          <span style={STYLES.label}>Private</span>
          <div style={STYLES.description}>
          Visible only to those with the secret project share-link.
          </div>
        </label>
      </form>
    )
  }
}

PrivatePublicToggle.propTypes = {
  isPublic: React.PropTypes.bool,
  onPublicToggle: React.PropTypes.func
}

export default PrivatePublicToggle
