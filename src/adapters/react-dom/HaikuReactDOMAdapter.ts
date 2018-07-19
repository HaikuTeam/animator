/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DEFAULTS} from '../../Config';
import getParsedProperty from '../../helpers/getParsedProperty';
import {randomString} from '../../helpers/StringUtils';
import EventsDict from './EventsDict';

const DEFAULT_HOST_ELEMENT_TAG_NAME = 'div';

export interface HaikuComponentProps {
  [key: string]: any;
}

export interface HaikuComponentState {
  randomId: string;
}

// tslint:disable-next-line:function-name
export default function HaikuReactDOMAdapter (haikuComponentFactory, optionalRawBytecode): {} {
  class HaikuReactComponentInternal extends React.Component<HaikuComponentProps, HaikuComponentState> {
    static React = React;
    static ReactDOM = ReactDOM;
    // This setting is required to do proper setup for placeholder/inject vanities
    static isHaikuAdapter = true;
    haiku;
    mount;

    constructor (props) {
      super(props);
      this.state = {
        // This random id is used to give us a hook to query the DOM for our mount element,
        // even in cases where React mysteriously decides not to pass us its ref.
        randomId: 'haiku-reactroot-' + randomString(24),
      };
    }

    componentWillReceiveProps (nextPropsRaw) {
      if (this.haiku) {
        const haikuConfig = this.buildHaikuCompatibleConfigFromRawProps(nextPropsRaw);
        this.haiku.assignConfig(haikuConfig);
      }
    }

    componentWillUnmount () {
      if (this.haiku) {
        this.haiku.callUnmount();
      }
    }

    componentDidMount () {
      this.attemptMount();
    }

    attemptMount () {
      if (this.mount) {
        this.createContext(this.props);
      }
    }

    buildHaikuCompatibleConfigFromRawProps (rawProps) {
      // Note that these vanities are called _after_ an initial render,
      // i.e., after this.mount is supposed to have been attached.
      let haikuConfig = {
        ref: this.mount,
        vanities: {
          'controlFlow.placeholder': function _controlFlowPlaceholderReactVanity (
            element,
            surrogate,
            value,
            context,
            timeline,
            receiver,
            sender,
          ) {
            visit(this.mount, (node) => {
              const flexId = flexIdIfSame(element, node);
              if (flexId) {
                if (element.__memory.placeholder.surrogate !== surrogate) {
                  if (
                    typeof surrogate.type === 'string' ||
                    (typeof surrogate.type === 'function' && surrogate.type.isHaikuAdapter)) {
                    // What *should happen* in the DOM renderer is:
                    // this new swapped DOM element will be updated (not replaced!)
                    // with the attributes of the virtual element at the same position
                    const div = document.createElement('div');
                    node.parentNode.replaceChild(div, node);
                    // tslint:disable-next-line:no-parameter-reassignment
                    node = div;

                    // We have to change the element name as well here so that the correct vanity behaviors
                    // are used when applying outputs to the placeheld element (e.g. opacity vs style.opacity).
                    element.elementName = 'div';
                  }
                  node.style.visibility = 'hidden';
                  ReactDOM.render(surrogate, node);
                  window.requestAnimationFrame(() => {
                    element.__memory.placeholder.surrogate = surrogate;
                    node.style.visibility = 'visible';
                  });
                  sender.markHorizonElement(element);
                  sender.markForFullFlush();
                }
              }
            });
          }.bind(this),
        },
      };

      // It's assumed that anything the user wants to pass into the Haiku engine should be
      // assigned among the whitelisted properties
      if (rawProps) {
        for (const verboseKeyName in rawProps) {
          // We already should have subscribed at the React host element level;
          // we don't pass in otherwise we can end up with multiple events fired
          if (EventsDict[verboseKeyName]) {
            continue;
          }

          haikuConfig = {...haikuConfig, ...getParsedProperty(rawProps, verboseKeyName)};
        }
      }

      return haikuConfig;
    }

    createContext (rawProps) {
      const haikuConfig = this.buildHaikuCompatibleConfigFromRawProps(rawProps);

      let haikuAdapter;

      if (rawProps.haikuAdapter) {
        if (rawProps.haikuCode) {
          haikuAdapter = rawProps.haikuAdapter(rawProps.haikuCode);
        } else if (optionalRawBytecode) {
          haikuAdapter = rawProps.haikuAdapter(optionalRawBytecode);
        } else {
          throw new Error('A Haiku code object is required if you supply a Haiku adapter');
        }
      } else {
        // Otherwise default to the adapter which was initialized in the wrapper module
        haikuAdapter = haikuComponentFactory;
      }

      if (!haikuAdapter) {
        throw new Error('A Haiku adapter is required');
      }

      // Reuse existing mounted component if one exists
      if (!this.haiku) {
        this.haiku = haikuAdapter( // eslint-disable-line
          this.mount,
          haikuConfig,
        );
      } else {
        // If the component already exists, update its options and make sure it remounts.
        // This action is important if we are in e.g. React Router.
        //
        // Important: Note that we should NOT call remount if we just initialized the instance (i.e. stanza above)
        // because we'll end up pausing the timelines before the first mount, resulting in a blank context.
        this.haiku.callRemount(haikuConfig);
      }
    }

    buildHostElementPropsFromRawProps (rawProps) {
      const propsForReactHostElement = {} as any;

      for (const key in rawProps) {
        if (willReactProbablyHandleProp(rawProps[key], key)) {
          if (EventsDict[key]) {
            // We wrap it because listeners expect to receive the Haiku component
            // instance as an argument; and for convenience we provide the native
            // event in addition to it and React's proxy
            propsForReactHostElement[key] = (proxy) => {
              return rawProps[key].call(
                this,
                proxy,
                proxy && proxy.nativeEvent,
                this.haiku,
              );
            };
          } else {
            propsForReactHostElement[key] = rawProps[key];
          }
        }
      }

      // Style objects are excluded above, but we definitely want it if provided
      const stylesForHostElement = rawProps.style || {};

      // Merge our basic host props with some defaults we want to assign
      return {
        id: this.state.randomId,
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%',
          transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
          ...stylesForHostElement,
        },
        ...propsForReactHostElement,
      };
    }

    assignMountFromRef (element) {
      this.mount = element;
    }

    render () {
      const hostElementProps = this.buildHostElementPropsFromRawProps(this.props);

      // Having this ref assigned like this is critical to the adapter working,
      // so we override it despite what the host element props might say
      hostElementProps.ref = (element) => {
        this.assignMountFromRef(element);
      };

      return React.createElement(
        hostElementProps.tagName || DEFAULT_HOST_ELEMENT_TAG_NAME,
        hostElementProps,
      );
    }
  }

  return HaikuReactComponentInternal;
}

function willReactProbablyHandleProp (prop: any, key: string) {
  // Exclude any 'complex' properties like objects
  if (prop && typeof prop === 'object') {
    return false;
  }

  // Assume functions, which are usually event listeners, are handled by Haiku
  if (typeof prop === 'function') {
    if (EventsDict[key]) {
      return true;
    }

    return false;
  }

  // Exclude props we know target Haiku config
  return !DEFAULTS.hasOwnProperty(key);
}

function visit (el, visitor) {
  if (el) {
    visitor(el);
    if (el.children) {
      for (let i = 0; i < el.children.length; i++) {
        visit(el.children[i], visitor);
      }
    }
  }
}

function flexIdIfSame (virtual, dom) {
  if (virtual.attributes) {
    if (virtual.attributes['haiku-id']) {
      if (dom.getAttribute('haiku-id') === virtual.attributes['haiku-id']) {
        return virtual.attributes['haiku-id'];
      }
    }

    if (virtual.attributes.id) {
      if (dom.getAttribute('id') === virtual.attributes.id) {
        return virtual.attributes.id;
      }
    }
  }

  return null;
}
