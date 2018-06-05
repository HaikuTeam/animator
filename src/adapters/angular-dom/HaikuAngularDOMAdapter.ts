/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  ModuleWithProviders,
  NgModule,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import HaikuComponent from '../../HaikuComponent';
import {randomString} from '../../helpers/StringUtils';

// tslint:disable-next-line:function-name
export default function HaikuAngularDOMAdapter (
  selector, haikuComponentFactory, optionalRawBytecode?): ModuleWithProviders {
  @Component({
    selector,
    template: `<div #mount class="haiku-angular-wrapper" [id]="randomId"></div>`,
    styles: [`
      div {
        position: relative;
        margin: 0;
        padding: 0;
        border: 0;
        width: 100%;
        height: 100%;
      }
    `],
  })
  class HaikuAngularComponentInternal implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild('mount') mount: ElementRef;

    @Output()
    componentWillInitialize = new EventEmitter<HaikuComponent>();
    @Output()
    componentDidInitialize = new EventEmitter<HaikuComponent>();
    @Output()
    componentDidMount = new EventEmitter<HaikuComponent>();
    @Output()
    componentWillUnmount = new EventEmitter<HaikuComponent>();

    @Input()
    seed?: string;
    @Input()
    timestamp?: number;
    @Input()
    automount: boolean = true;
    @Input()
    autoplay: boolean = true;
    @Input()
    forceFlush: boolean = true;
    @Input()
    freeze: boolean = true;
    @Input()
    frame?: Function;
    @Input()
    clock: {frameDuration?: number, frameDelay?: number, marginOfErrorForDelta?: number} = {};
    @Input()
    sizing?: string;
    @Input()
    alwaysComputeSizing?: boolean = true;
    @Input()
    preserve3d: string;
    @Input()
    contextMenu: string;
    @Input()
    position: string;
    @Input()
    overflowX?: string;
    @Input()
    overflowY?: string;
    @Input()
    overflow?: string;
    @Input()
    mixpanel: string;
    @Input()
    useWebkitPrefix?: boolean;
    @Input()
    interactionMode?: string;
    @Input()
    states?: {[key in string]: any};
    @Input()
    eventHandlers?: {[key in string]: any};
    @Input()
    timelines?: {[key in string]: any};
    @Input()
    vanities?: {[key in string]: any};
    @Input()
    placeholder?: any;
    @Input()
    haikuAdapter?: any;
    @Input()
    haikuCode?: any;

    static isHaikuAdapter = true;
    haikuConfig: {[key in string]: any} = {
      onComponentWillInitialize: (component) => this.componentWillInitialize.emit(component),
      onComponentDidInitialize: (component) => this.componentDidInitialize.emit(component),
      onComponentDidMount: (component) => this.componentDidMount.emit(component),
      onComponentWillUnmount: (component) => this.componentWillUnmount.emit(component),
    };
    haiku;
    randomId: string = `haiku-angularroot-${randomString(24)}`;

    ngOnChanges (changes: SimpleChanges) {
      this.haikuConfig = Object.keys(changes).reduce(
        (accumulator, configKey) => {
          accumulator[configKey] = changes[configKey].currentValue;
          return accumulator;
        },
        this.haikuConfig,
      );

      if (this.haiku) {
        this.haiku.assignConfig(this.haikuConfig);
      }
    }

    ngAfterViewInit () {
      let haikuAdapter;

      if (this.haikuAdapter) {
        if (this.haikuCode) {
          haikuAdapter = this.haikuAdapter(this.haikuCode);
        } else if (optionalRawBytecode) {
          haikuAdapter = this.haikuAdapter(optionalRawBytecode);
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
          this.mount.nativeElement,
          this.haikuConfig,
        );
      } else {
        // If the component already exists, update its options and make sure it remounts.
        // This action is important if we are in e.g. React Router.
        //
        // Important: Note that we should NOT call remount if we just initialized the instance (i.e. stanza above)
        // because we'll end up pausing the timelines before the first mount, resulting in a blank context.
        this.haiku.callRemount(this.haikuConfig);
      }
    }

    ngOnDestroy () {
      if (this.haiku) {
        this.haiku.callUnmount();
      }
    }
  }

  @NgModule({
    declarations: [HaikuAngularComponentInternal],
    exports: [HaikuAngularComponentInternal],
  })
  class HaikuModule {}

  return {
    ngModule: HaikuModule,
  };
}
