import * as React from 'react';
import * as Radium from 'radium';
import * as Color from 'color';
import {shell} from 'electron';
import {shake} from 'react-animations';
import {FadingCircle} from 'better-react-spinkit';
import Palette from 'haiku-ui-common/lib/Palette';
import {UserIconSVG, PasswordIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import AnimatorSVG from 'haiku-ui-common/lib/react/icons/AnimatorSVG';
import {getAccountUrl, getUrl} from 'haiku-common/lib/environments';

const STYLES = {
  container: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.GRAY,
  },
  errorShake: {
    animation: 'x 890ms',
    animationName: Radium.keyframes(shake, 'shake'),
  },
  formWrap: {
    backgroundColor: Palette.COAL,
    position: 'relative',
    zIndex: 2,
    width: 375,
    minHeight: 200,
    borderRadius: 7,
    padding: '47px 27px 20px',
    boxShadow: '0 33px 40px 6px rgba(21,32,34,0.21)',
  },
  center: {
    textAlign: 'center',
  },
  title: {
    WebkitUserSelect: 'none',
    cursor: 'default',
    fontSize: 21,
    color: Palette.ROCK,
    margin: '20px auto 38px auto',
  },
  inputHolster: {
    position: 'relative',
  },
  logoHolster: {
    width: 96,
    margin: '0 auto',
  },
  tooltip: {
    backgroundColor: Color(Palette.RED).fade(0.1),
    color: Palette.ROCK,
    position: 'absolute',
    right: '-170px',
    top: 11,
    padding: '7px 16px',
    fontSize: 13,
    borderRadius: 4,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    position: 'absolute',
    left: -8,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid ' + Color(Palette.RED).fade(0.1),
  },
  inputIcon: {
    position: 'absolute',
    right: 24,
    top: 19,
    zIndex: 1,
  },
  iconAdjust: {
    right: 25,
  },
  input: {
    backgroundColor: Color(Palette.COAL).darken(0.2),
    width: '100%',
    height: 55,
    borderRadius: 5,
    marginBottom: 15,
    border: '1px solid ' + Palette.FATHER_COAL,
    fontSize: 18,
    padding: '27px',
    color: Palette.ROCK,
    fontFamily: 'inherit',
    ':focus': {
      border: '1px solid ' + Palette.DARK_GRAY,
    },
  },
  errorInput: {
    border: '1px solid ' + Color(Palette.RED).fade(0.1),
  },
  btn: {
    backgroundColor: Palette.LIGHTEST_PINK,
    borderRadius: 5,
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 22,
    letterSpacing: 1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Palette.SUNSTONE,
    ':focus': {
      border: '1px solid ' + Palette.LIGHT_BLUE,
    },
  },
  btnDisabled: {
    backgroundImage: 'none',
    backgroundColor: Palette.DARK_GRAY,
    cursor: 'not-allowed',
  },
  error: {
    backgroundColor: Color(Palette.RED).fade(0.5),
    color: Palette.SUNSTONE,
    width: 'calc(100% + 54px)',
    padding: 20,
    margin: '-27px 0 12px -27px',
    fontSize: 14,
  },
  link: {
    color: Palette.LIGHTEST_PINK,
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'inline-block',
  },
};

class AuthenticationUI extends React.Component {
  constructor (props) {
    super(props);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      error: null,
      isSubmitting: false,
      isSuccess: false,
      username: '',
      password: '',
      emailValid: true,
      lastSentUsername: null,
    };
  }

  componentDidMount () {
    this.refs.email.focus();
  }

  handleUsernameChange (changeEvent) {
    return this.setState({username: changeEvent.target.value});
  }

  handlePasswordChange (changeEvent) {
    return this.setState({password: changeEvent.target.value});
  }

  handleSubmit (submitEvent) {
    this.setState({isSubmitting: true, error: null, lastSentUsername: this.state.username});
    return this.props.onSubmit(this.state.username, this.state.password, (error) => {
      if (error) {
        this.refs.email.focus();
        return this.setState({error, isSubmitting: false});
      }

      this.setState({isSubmitting: false, isSuccess: true}, this.props.onSubmitSuccess);
    });
  }

  checkSubmit (e) {
    if (e.charCode === 13) {
      if (validUsername(this.state.username)) {
        this.handleSubmit();
      } else {
        this.setState({emailValid: false});
      }
    }
  }

  validateIsEmailAddress () {
    let isEmail = validUsername(this.refs.email.value);
    if (this.refs.email.value === '') {
      isEmail = true;
    } // to avoid showing error state if blank

    isEmail
      ? this.setState({emailValid: true})
      : this.setState({emailValid: false});
  }

  usernameElement () {
    return (
      <div style={STYLES.inputHolster}>
        <input
          type="text"
          placeholder="Username or Email"
          key="username"
          ref="email"
          value={this.state.username}
          onChange={this.handleUsernameChange}
          onFocus={() => {
            this.setState({emailValid: true});
          }}
          onBlur={(e) => {
            this.validateIsEmailAddress(e);
          }}
          disabled={this.state.isSubmitting || this.state.isSuccess}
          onKeyPress={this.checkSubmit}
          style={[STYLES.input, !this.state.emailValid && STYLES.errorInput]} />
        <span style={STYLES.inputIcon}>
          <UserIconSVG color={Palette.LIGHT_GRAY} width="15px" height="20px" />
        </span>
        { this.state.emailValid
            ? ''
            : <span style={STYLES.tooltip}><span style={STYLES.arrowLeft} />No special characters</span> }
      </div>
    );
  }

  passwordElement () {
    return (
      <div style={STYLES.inputHolster}>
        <input
          type="password"
          placeholder="Password"
          key="pass"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          disabled={this.state.isSubmitting || this.state.isSuccess}
          onKeyPress={this.checkSubmit}
          style={STYLES.input} />
        <span style={[STYLES.inputIcon, STYLES.iconAdjust]}>
          <PasswordIconSVG />
        </span>
      </div>
    );
  }

  generateErrorSpec () {
    const {message, code} = this.state.error;

    switch (code) {
      case 403:
        return {
          backgroundColor: Color(Palette.ORANGE).fade(0.5),
          message: (
            <p>
              {message} <br />
              <span
                style={{...STYLES.link, color: Palette.COAL}}
                ref={(span) => {
                  this.verificationText = span;
                }}
                onClick={() => {
                  if (this.state.lastSentUsername) {
                    this.props.resendEmailConfirmation(this.state.lastSentUsername);
                    this.verificationText.innerHTML = 'Sent!';
                  }
                }}
              >
                Send verification again.
              </span>
            </p>
          ),
        };
      case 407:
        // (we think) proxy authentication might be required.
        return {
          backgroundColor: Color(Palette.RED).fade(0.5),
          message,
          action: this.props.onShowProxySettings,
          actionText: 'Change proxy settings.',
        };
      default:
        return {
          backgroundColor: Color(Palette.RED).fade(0.5),
          message,
        };
    }
  }

  errorElement () {
    if (this.state.error) {
      const {message, backgroundColor, action, actionText} = this.generateErrorSpec();

      if (action && actionText) {
        return (
          <div style={{...STYLES.error, backgroundColor}}>
            <span>{message}</span>
            {' '}
            <span style={{...STYLES.link, color: Palette.SUNSTONE}} onClick={action}>{actionText}</span>
          </div>
        );
      }

      return <div style={{...STYLES.error, backgroundColor}}>{message}</div>;
    }
  }

  submitButtonElement () {
    let submitButtonMessage;
    if (this.state.isSubmitting) {
      submitButtonMessage = <FadingCircle size={22} color={Palette.ROCK} />;
    } else if (this.state.isSuccess) {
      submitButtonMessage = 'Success!';
    } else {
      submitButtonMessage = 'Log In';
    }
    return (
      <button
        id="haiku-button-login"
        style={[STYLES.btn, !this.state.emailValid && STYLES.btnDisabled]}
        onClick={this.handleSubmit}
        disabled={this.state.isSubmitting || this.state.isSuccess || !this.state.emailValid}>
        {submitButtonMessage}
      </button>
    );
  }

  render () {
    return (
      <div style={STYLES.container}>
        <div style={[STYLES.formWrap, STYLES.center, this.state.error && STYLES.errorShake]}>
          <div style={STYLES.logoHolster}><AnimatorSVG /></div>
          <div style={STYLES.title}>Log in to Your Account</div>
          {this.errorElement()}
          {this.usernameElement()}
          {this.passwordElement()}
          {this.submitButtonElement()}
          <p style={{marginTop: '22px', marginBottom: '6px'}}>
            Don't have an account?{' '}
            <span
              style={STYLES.link}
              onClick={() => {
                shell.openExternal(getAccountUrl('new'));
              }}
            >
              Sign up
            </span>
          </p>
          <p style={{margin: 0}}>
            Or {' '}
            <span
              style={STYLES.link}
              onClick={() => {
                shell.openExternal(getAccountUrl('reset-password'));
              }}
            >
              forgot your password?
            </span>
          </p>

        </div>
        <div style={{
          position: 'absolute',
          bottom: 50,
          color: Palette.ROCK,
        }}>
          By logging into Haiku you agree to our <span style={{...STYLES.link, marginTop: '30px'}} onClick={() => {
            shell.openExternal(getUrl('terms-of-service.html'));
          }}>terms and conditions</span>
        </div>
      </div>
    );
  }
}

function validUsername (name) {
  const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regAlphaNumeric = /^[A-Za-z0-9]+$/;
  return regEmail.test(name) || regAlphaNumeric.test(name);
}

export default Radium(AuthenticationUI);
