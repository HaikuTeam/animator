import React from 'react'
import Radium from 'radium'
import Color from 'color'
import { shake } from 'react-animations'
import { FadingCircle } from 'better-react-spinkit'
import Palette from './Palette'
import { LogoGradientSVG, UserIconSVG, PasswordIconSVG } from './Icons'

const STYLES = {
  container: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorShake: {
    animation: 'x 890ms',
    animationName: Radium.keyframes(shake, 'shake')
  },
  formWrap: {
    backgroundColor: Palette.ROCK,
    width: 375,
    minHeight: 200,
    borderRadius: 7,
    padding: '47px 27px',
    boxShadow: '0 33px 40px 6px rgba(24,0,8,0.21)'
  },
  center: {
    textAlign: 'center'
  },
  title: {
    WebkitUserSelect: 'none',
    cursor: 'default',
    fontSize: 21,
    color: Palette.MEDIUM_COAL,
    margin: '20px auto 38px auto'
  },
  inputHolster: {
    position: 'relative'
  },
  tooltip: {
    backgroundColor: Color(Palette.RED).fade(0.1),
    color: Palette.ROCK,
    position: 'absolute',
    right: '-170px',
    top: 11,
    padding: '7px 16px',
    fontSize: 13,
    borderRadius: 4
  },
  arrowLeft: {
    width: 0,
    height: 0,
    position: 'absolute',
    left: -8,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid ' + Color(Palette.RED).fade(0.1)
  },
  inputIcon: {
    position: 'absolute',
    right: 24,
    top: 19,
    zIndex: 1
  },
  iconAdjust: {
    right: 25
  },
  input: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 55,
    borderRadius: 5,
    marginBottom: 15,
    border: '1px solid #DEDEDE',
    fontSize: 18,
    padding: '27px',
    ':focus': {
      border: '1px solid ' + Palette.LIGHT_BLUE
    }
  },
  errorInput: {
    border: '1px solid ' + Color(Palette.RED).fade(0.1)
  },
  btn: {
    backgroundImage: 'linear-gradient(90deg, #D72B60 0%, #F0CC0D 100%)',
    borderRadius: 5,
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 22,
    letterSpacing: 1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Palette.ROCK,
    ':focus': {
      border: '1px solid ' + Palette.LIGHT_BLUE
    }
  },
  btnDisabled: {
    backgroundImage: 'none',
    backgroundColor: Palette.DARK_ROCK,
    cursor: 'not-allowed'
  },
  error: {
    backgroundColor: Color(Palette.RED).fade(0.5),
    color: Palette.ROCK,
    width: 'calc(100% + 54px)',
    padding: 20,
    margin: '-27px 0 12px -27px',
    fontSize: 14
  }
}

class AuthenticationUI extends React.Component {
  constructor (props) {
    super(props)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.checkSubmit = this.checkSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      error: null,
      isSubmitting: false,
      isSuccess: false,
      username: '',
      password: '',
      emailValid: true
    }
  }

  componentDidMount () {
    this.refs.email.focus()
  }

  handleUsernameChange (changeEvent) {
    return this.setState({ username: changeEvent.target.value })
  }

  handlePasswordChange (changeEvent) {
    return this.setState({ password: changeEvent.target.value })
  }

  handleSubmit (submitEvent) {
    this.setState({ isSubmitting: true, error: null })
    return this.props.onSubmit(this.state.username, this.state.password, (error) => {
      if (error) return this.setState({ error, isSubmitting: false })
      this.setState({ isSubmitting: false, isSuccess: true })
      this.props.onSubmitSuccess()
    })
  }

  checkSubmit (e) {
    if (e.charCode === 13) {
      if (validUsername(this.state.username)) {
        this.handleSubmit()
      } else {
        this.setState({emailValid: false})
      }
    }
  }

  validateIsEmailAddress () {
    let isEmail = validUsername(this.refs.email.value)
    if (this.refs.email.value === '') isEmail = true // to avoid showing error state if blank

    isEmail
      ? this.setState({ emailValid: true })
      : this.setState({ emailValid: false })
  }

  usernameElement () {
    return (
      <div style={STYLES.inputHolster}>
        <input
          type='text'
          placeholder='Email'
          key='username'
          ref='email'
          value={this.state.username}
          onChange={this.handleUsernameChange}
          onFocus={() => { this.setState({ emailValid: true }) }}
          onBlur={(e) => { this.validateIsEmailAddress(e) }}
          disabled={this.state.isSubmitting || this.state.isSuccess}
          onKeyPress={this.checkSubmit}
          style={[STYLES.input, !this.state.emailValid && STYLES.errorInput]} />
        <span style={STYLES.inputIcon}>
          <UserIconSVG />
        </span>
        { this.state.emailValid
            ? ''
            : <span style={STYLES.tooltip}><span style={STYLES.arrowLeft} />Invalid characters: please enter your username or email address</span> }
      </div>
    )
  }

  passwordElement () {
    return (
      <div style={STYLES.inputHolster}>
        <input
          type='password'
          placeholder='Password'
          key='pass'
          value={this.state.password}
          onChange={this.handlePasswordChange}
          disabled={this.state.isSubmitting || this.state.isSuccess}
          onKeyPress={this.checkSubmit}
          style={STYLES.input} />
        <span style={[STYLES.inputIcon, STYLES.iconAdjust]}>
          <PasswordIconSVG />
        </span>
      </div>
    )
  }

  errorElement () {
    if (this.state.error) {
      var err = this.state.error.message
      // hacky: special-case Unauthorized error to be a bit more friendly
      if (err === 'Unauthorized') { err = 'Username or Password Incorrect' }
      return (
        <div style={STYLES.error}>
          <p>{err}</p>
        </div>
      )
    }
  }

  submitButtonElement () {
    let submitButtonMessage
    if (this.state.isSubmitting) submitButtonMessage = <FadingCircle size={22} color={Palette.ROCK} />
    else if (this.state.isSuccess) submitButtonMessage = 'Success!'
    else submitButtonMessage = 'Log In'
    return (
      <button
        style={[STYLES.btn, !this.state.emailValid && STYLES.btnDisabled]}
        onClick={this.handleSubmit}
        disabled={this.state.isSubmitting || this.state.isSuccess || !this.state.emailValid}>
        {submitButtonMessage}
      </button>
    )
  }

  render () {
    return (
      <div style={[STYLES.container, this.state.error && STYLES.errorShake]}>
        <div style={[STYLES.formWrap, STYLES.center]}>
          <LogoGradientSVG />
          <div style={STYLES.title}>Log in to Your Account</div>
          {this.errorElement()}
          {this.usernameElement()}
          {this.passwordElement()}
          {this.submitButtonElement()}
        </div>
        <div style={{
          position: 'absolute',
          bottom: 50,
          color: '#999'
        }}>
          By logging into Haiku you agree to our <span style={{ color: '#efa70d', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { require('electron').shell.openExternal('https://www.haiku.ai/terms-of-service.html') }}>terms and conditions</span>
        </div>
      </div>
    )
  }
}

function validUsername (name) {
  var regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var regAlphaNumeric = /^[A-Za-z0-9]+$/
  return regEmail.test(name) || regAlphaNumeric.test(name)
}

export default Radium(AuthenticationUI)
