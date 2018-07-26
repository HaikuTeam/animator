/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import getParsedProperty from '../../helpers/getParsedProperty';
import {randomString} from '../../helpers/StringUtils';

function clearProps (props): Object {
  let result = {};

  for (const verboseKeyName in props) {
    if (props[verboseKeyName] === undefined) {
      continue;
    }

    result = {...result, ...getParsedProperty(props, verboseKeyName)};
  }

  return result;
}

// tslint:disable-next-line:function-name
export default function HaikuVueDOMAdapter (haikuComponentFactory): {} {
  return {
    props: {
      // We use null (which is the equivalent of 'any') for Boolean values
      // because Vue does typecasting for us, which sets undefined to false.
      automount: null,
      autoplay: null,
      forceFlush: null,
      freeze: null,
      loop: null,
      alwaysComputeSizing: null,
      seed: String,
      sizing: String,
      timestamp: Number,
      frame: Function,
      clock: Object,
      preserve3d: String,
      contextMenu: String,
      position: String,
      overflowX: String,
      overflowY: String,
      overflow: String,
      mixpanel: String,
      interactionMode: Object,
      states: Object,
      eventHandlers: Object,
      timelines: Object,
      vanities: Object,
      children: Array,
      placeholder: Object,
      // LEGACY
      haikuOptions: Object,
    },
    mounted () {
      const clearedProps = clearProps(this.$props);

      this.haiku = haikuComponentFactory(this.$el, {
        ...clearedProps,
        ref: this.$el,
        onHaikuComponentWillInitialize: (component) => {
          this.$emit('haikuComponentWillInitialize', component);
        },
        onHaikuComponentDidMount: (component) => {
          this.$emit('haikuComponentDidMount', component);
        },
        onHaikuComponentWillMount: (component) => {
          this.$emit('haikuComponentWillMount', component);
        },
        onHaikuComponentDidInitialize: (component) => {
          this.$emit('haikuComponentDidInitialize', component);
        },
        onHaikuComponentWillUnmount: (component) => {
          this.$emit('haikuComponentWillUnmount', component);
        },
      });
    },
    updated () {
      const clearedProps = clearProps(this.$props);
      this.haiku.assignConfig(clearedProps);
    },
    destroyed () {
      this.haiku.callUnmount();
    },
    render (createElement) {
      return createElement('div', {
        attrs: {
          id: 'haiku-vueroot-' + randomString(24),
        },
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%',
          transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
        },
      });
    },
  };
}
