declare let has: any;
declare let ColorUtils: any;
declare let SVGPoints: any;
declare function parseD(value: any): any;
declare function generateD(value: any): any;
declare function parseColor(value: any): any;
declare function generateColor(value: any): any;
declare function parsePoints(value: any): any;
declare function generatePoints(value: any): any;
declare let STYLE_COLOR_PARSERS: {
    "style.stroke": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.fill": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.backgroundColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.borderBottomColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.borderColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.borderLeftColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.borderRightColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.borderTopColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.floodColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.lightingColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "style.stopColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
};
declare let SVG_COLOR_PARSERS: {
    "stroke": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "fill": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "floodColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "lightingColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "stopColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "backgroundColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "animateColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "feColor": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "flood-color": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "lighting-color": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "stop-color": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "background-color": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "animate-color": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
    "fe-color": {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
};
declare let SVG_PATH_PARSERS: {
    d: {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
};
declare let SVG_POINT_PARSERS: {
    points: {
        parse: (value: any) => any;
        generate: (value: any) => any;
    };
};
