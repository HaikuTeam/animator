import * as React from 'react';
import HaikuDOMAdapter from '@haiku/core/lib/adapters/dom/HaikuDOMAdapter';
import {InteractionMode} from '@haiku/core/lib/helpers/interactionModes';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

export default class Preview extends React.Component {
  mountHaikuComponent () {
    // If somehow the previous component still exists, destroy it
    if (this.component) {
      this.component.getClock().stop();
    }

    // We can't load from disk because the update may have not synchronized by the point that
    // preview mode is launched, so instead we just create a pristine copy of the bytecode
    const factory = HaikuDOMAdapter(this.props.component.getReifiedBytecode());

    const handleStateChange = (attachedObject) => {
      // Don't log if the values are already equivalent (unchanged)
      if (attachedObject.to === attachedObject.from) {
        return;
      }

      let message = '';

      if (attachedObject.queued) {
        message = `State transition ${attachedObject.state} to target ${attachedObject.to} with duration ${attachedObject.duration} queued`;
      } else if (attachedObject.started) {
        message = `State transition ${attachedObject.state} to target ${attachedObject.to} with duration ${attachedObject.duration} started`;
      } else if (attachedObject.finished) {
        message = `State transition ${attachedObject.state} to target ${attachedObject.to} with duration ${attachedObject.duration} finished`;
      } else {
        message = `State ${attachedObject.state} changed from ${attachedObject.from} to ${attachedObject.to}`;
      }

      logger.traceInfo('state:change', message, attachedObject);
    };

    const handleActionBefore = (component, name, selector) => {
      // no-op for now
    };

    const handleActionAfter = (component, name, selector) => {
      const message = `Action ${name} fired on element ${selector}`;

      logger.traceInfo('action:fired', message, {
        action: name,
        element: selector,
        componentTitle: component.title,
      });
    };

    const handleTimelineLoop = (attachedObject) => {
      const message = `Loop count ${attachedObject.loopCount}`;
      logger.traceInfo('loop', message, attachedObject);
    };

    this.component = factory(
      this.mount,
      {
        alwaysComputeSizing: false,
        loop: true,
        interactionMode: InteractionMode.LIVE,
        autoplay: true,
        mixpanel: false,
        contextMenu: 'disabled',
        hooks: {
          'action:before': handleActionBefore,
          'action:after': handleActionAfter,
          'state:change': handleStateChange,
          'timeline:loop': handleTimelineLoop,
        },
      },
    );

    this.component.render(this.component.config);
  }

  componentDidMount () {
    if (this.mount) {
      this.mountHaikuComponent();
    }
  }

  componentWillUnmount () {
    if (this.component) {
      this.component.getClock().stop();
      this.component.context.destroy();
    }
  }

  render () {
    return (
      <div
        id="haiku-glass-preview-wrapper"
        style={{
          position: 'relative',
          top: this.props.container.y,
          left: this.props.container.x,
          width: this.props.container.w,
          height: this.props.container.h,
        }}>
        <div
          ref={(mount) => {
            this.mount = mount;
          }}
          id="haiku-stage"
          style={{
            position: 'absolute',
            top: this.props.mount.y,
            left: this.props.mount.x,
            width: this.props.mount.w,
            height: this.props.mount.h,
            outline: '1px dotted #bbb',
            borderRadius: '2px',
          }} />
      </div>
    );
  }
}

Preview.propTypes = {
  component: React.PropTypes.object.isRequired,
  mount: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired,
};
