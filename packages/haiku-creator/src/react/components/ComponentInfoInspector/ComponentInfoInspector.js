import * as React from 'react';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';
import Loader from './Loader';

const STYLES = {
  scrollwrap: {
    overflowY: 'auto',
    height: '100%',
  },
  sectionHeader: {
    cursor: 'default',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px 0',
    fontSize: 15,
    justifyContent: 'space-between',
  },
  sectionWrapper: {
    paddingTop: 6,
    paddingBottom: 6,
    position: 'relative',
    minHeight: '300px',
    overflow: 'hidden',
  },
  link: {
    color: Palette.SUNSTONE,
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'inline-block',
  },
  input: {
    backgroundColor: Palette.COAL,
    padding: '4px 5px 3px',
    WebkitUserSelect: 'auto',
    cursor: 'text',
    color: Palette.ROCK,
    width: 'calc(100% - 4px)',
    minHeight: 22,
    fontSize: 12,
    fontFamily: 'Fira Sans',
    border: '1px solid transparent',
    borderRadius: '2px',
    outline: 'none',
    ':focus': {
      border: '1px solid ' + Palette.LIGHTEST_PINK,
    },
  },
};

class ComponentInfoInspector extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      error: null,
      isLoading: false,
      componentInfo: null,
    };

    this.broadcastListener = this.broadcastListener.bind(this);
  }

  broadcastListener () {
  }

  componentDidMount () {
    this.setState({isLoading: true});
    this.reloadComponentInfo();
    this.props.websocket.on('broadcast', this.broadcastListener);
  }

  componentWillUnmount () {
    this.props.websocket.removeListener('broadcast', this.broadcastListener);
  }

  reloadComponentInfo () {
    return this.props.projectModel.readComponentInfo(
      this.props.projectModel.getCurrentActiveComponentSceneName(),
      (error, componentInfo) => {
        if (error) {
          return this.setState({error});
        }
        this.setState({componentInfo, isLoading: false});
      },
    );
  }

  renderComponentInfoForm () {
    const componentInfo = this.state.componentInfo || {};

    const description = componentInfo.description || '';

    let keywords = componentInfo.keywords || '';
    if (Array.isArray(keywords)) {
      keywords = keywords.join(', ');
    }

    return (
      <div
        style={{
          marginLeft: 15,
          marginRight: 20,
        }}>

        <span style={{display: 'inline-block', marginBottom: 3}}>
          Name
        </span>

        <span style={{display: 'inline-block', marginBottom: 3}}>
          Author
        </span>

        <span style={{display: 'inline-block', marginBottom: 3}}>
          Version
        </span>

        <span style={{display: 'inline-block', marginBottom: 3}}>
          Share URL
        </span>

        <span style={{display: 'inline-block', marginBottom: 3}}>
          Public/Private
        </span>

        <span style={{display: 'inline-block', marginBottom: 3}}>
          License
        </span>

        <span style={{display: 'inline-block', marginBottom: 3}}>
          Description
        </span>
        <textarea
          key="component_info_description_textarea"
          style={[STYLES.input, {height: 75, marginBottom: 20, resize: 'none'}]}
          value={description}
          placeholder="Short description of your component"
          onChange={(event) => {
            componentInfo.description = event.target.value || '';
            this.setState({componentInfo});
          }} />

        <span style={{display: 'inline-block', marginBottom: 3}}>
          Keywords
        </span>
        <textarea
          key="component_info_keywords_textarea"
          style={[STYLES.input, {height: 75, marginBottom: 20, resize: 'none'}]}
          value={keywords}
          placeholder="List of comma-separated keywords"
          onChange={(event) => {
            componentInfo.keywords = event.target.value || '';
            this.setState({componentInfo});
          }} />
      </div>
    );
  }

  render () {
    return (
      <div
        id="component-info-inspector-wrapper"
        style={{height: '100%', display: this.props.visible ? 'initial' : 'none'}}>
        <div
          style={STYLES.sectionHeader}>
          Component Info
        </div>
        <div
          id="component-info-inspector-scroll-wrap"
          style={STYLES.scrollwrap}>
          <div style={STYLES.sectionWrapper}>
            {this.state.isLoading
              ? <Loader />
              : this.renderComponentInfoForm()}
          </div>
        </div>
      </div>
    );
  }
}

ComponentInfoInspector.propTypes = {
  projectModel: React.PropTypes.object.isRequired,
};

export default Radium(ComponentInfoInspector);
