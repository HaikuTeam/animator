declare let computeMatrix: any;
declare let computeRotationFlexibly: any;
declare let computeSize: any;
declare let ELEMENTS_2D: {
    circle: boolean;
    ellipse: boolean;
    foreignObject: boolean;
    g: boolean;
    image: boolean;
    line: boolean;
    mesh: boolean;
    path: boolean;
    polygon: boolean;
    polyline: boolean;
    rect: boolean;
    svg: boolean;
    switch: boolean;
    symbol: boolean;
    text: boolean;
    textPath: boolean;
    tspan: boolean;
    unknown: boolean;
    use: boolean;
};
declare let SIZE_PROPORTIONAL: number;
declare let SIZE_ABSOLUTE: number;
declare let DEFAULT_DEPTH: number;
declare let IDENTITY: number[];
declare let FORMATS: {
    THREE: number;
    TWO: number;
};
declare function initializeNodeAttributes(element: any, parent: any): any;
declare function initializeTreeAttributes(tree: any, container: any): void;
declare function createLayoutSpec(ax: any, ay: any, az: any): {
    shown: boolean;
    opacity: number;
    mount: {
        x: any;
        y: any;
        z: any;
    };
    align: {
        x: any;
        y: any;
        z: any;
    };
    origin: {
        x: any;
        y: any;
        z: any;
    };
    translation: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    scale: {
        x: number;
        y: number;
        z: number;
    };
    sizeMode: {
        x: number;
        y: number;
        z: number;
    };
    sizeProportional: {
        x: number;
        y: number;
        z: number;
    };
    sizeDifferential: {
        x: number;
        y: number;
        z: number;
    };
    sizeAbsolute: {
        x: number;
        y: number;
        z: number;
    };
};
declare function createMatrix(): any;
declare function copyMatrix(out: any, m: any): any;
declare function multiplyMatrices(out: any, a: any, b: any): any;
declare function transposeMatrix(out: any, a: any): any;
declare function multiplyArrayOfMatrices(arrayOfMatrices: any): any;
declare function isZero(num: any): boolean;
declare function createBaseComputedLayout(x: any, y: any, z: any): {
    size: {
        x: any;
        y: any;
        z: any;
    };
    matrix: any;
    shown: boolean;
    opacity: number;
};
declare function computeLayout(out: any, layoutSpec: any, currentMatrix: any, parentMatrix: any, parentsizeAbsolute: any): any;
