declare let _extends: any;
declare function _objectWithoutProperties(obj: any, keys: any): {};
declare let toPoints: (_ref: any) => any;
declare let getPointsFromCircle: (_ref2: any) => ({
    x: any;
    y: number;
    moveTo: boolean;
} | {
    x: any;
    y: any;
    curve: {
        type: string;
        rx: any;
        ry: any;
        sweepFlag: number;
    };
})[];
declare let getPointsFromEllipse: (_ref3: any) => ({
    x: any;
    y: number;
    moveTo: boolean;
} | {
    x: any;
    y: any;
    curve: {
        type: string;
        rx: any;
        ry: any;
        sweepFlag: number;
    };
})[];
declare let getPointsFromLine: (_ref4: any) => ({
    x: any;
    y: any;
    moveTo: boolean;
} | {
    x: any;
    y: any;
})[];
declare let validCommands: RegExp;
declare let commandLengths: {
    A: number;
    C: number;
    H: number;
    L: number;
    M: number;
    Q: number;
    S: number;
    T: number;
    V: number;
    Z: number;
};
declare let relativeCommands: string[];
declare let isRelative: (command: any) => boolean;
declare let optionalArcKeys: string[];
declare let getCommands: (d: any) => any;
declare let getParams: (d: any) => any;
declare let getPointsFromPath: (_ref5: any) => any[];
declare let getPointsFromPolygon: (_ref7: any) => any;
declare let getPointsFromPolyline: (_ref8: any) => any;
declare let getPointsFromPoints: (_ref9: any) => any;
declare let getPointsFromRect: (_ref10: any) => ({
    x: any;
    y: any;
    moveTo: boolean;
} | {
    x: any;
    y: any;
    curve: {
        type: string;
        rx: any;
        ry: any;
        sweepFlag: number;
    };
} | {
    x: any;
    y: any;
})[];
declare let getPointsFromBasicRect: (_ref11: any) => ({
    x: any;
    y: any;
    moveTo: boolean;
} | {
    x: any;
    y: any;
})[];
declare let getPointsFromRectWithCornerRadius: (_ref12: any) => ({
    x: any;
    y: any;
    moveTo: boolean;
} | {
    x: any;
    y: any;
    curve: {
        type: string;
        rx: any;
        ry: any;
        sweepFlag: number;
    };
} | {
    x: any;
    y: any;
})[];
declare let getPointsFromG: (_ref13: any) => any;
