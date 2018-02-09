/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {randomString} from '../../helpers/StringUtils';

export interface HaikuVueComponent {}

// tslint:disable-next-line:function-name
export default function HaikuVueDOMAdapter(haikuComponentFactory): HaikuVueComponent {
  return {
    props: {
      haikuOptions: Object,
      haikuStates: Object,
      eventHandlers: Object,
      timelines: Object,
      vanities: Object,
      placeholder: Object,
    },
    mounted() {
      this.haiku = haikuComponentFactory(this.$el, {
        ref: this.$el,
        options: this.$props.haikuOptions,
        states: this.$props.haikuStates,
        eventHandlers: this.$props.eventHandlers,
        timelines: this.$props.timelines,
        vanities: this.$props.vanities,
        placeholder: this.$props.placeholder,
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
    updated() {
      this.haiku.assignConfig({
        options: this.$props.haikuOptions,
        states: this.$props.haikuStates,
      });
    },
    destroyed() {
      this.haiku.callUnmount();
    },
    render(createElement) {
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
