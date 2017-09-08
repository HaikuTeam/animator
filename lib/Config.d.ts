declare let assign: any;
declare let Config: {};
declare let DEFAULTS: {
    onHaikuComponentWillInitialize: any;
    onHaikuComponentDidMount: any;
    onHaikuComponentWillMount: any;
    onHaikuComponentDidInitialize: any;
    onHaikuComponentWillUnmount: any;
    options: {
        seed: any;
        automount: boolean;
        autoplay: boolean;
        forceFlush: boolean;
        freeze: boolean;
        loop: boolean;
        frame: any;
        clock: {};
        sizing: any;
        preserve3d: string;
        contextMenu: string;
        position: string;
        overflowX: any;
        overflowY: any;
        overflow: any;
        mixpanel: string;
        useWebkitPrefix: any;
        cache: {};
        interactionMode: {
            type: string;
        };
    };
    states: any;
    eventHandlers: any;
    timelines: any;
    vanities: any;
    children: any;
};
declare function _seed(): string;
declare function _build(): {};
