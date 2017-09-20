declare const _default: {
    computeMatrix: (outputMatrix: any, outputNodepad: any, layoutSpec: any, currentMatrix: any, currentsizeAbsolute: any, parentMatrix: any, parentsizeAbsolute: any) => any;
    multiplyArrayOfMatrices: (arrayOfMatrices: any) => any;
    computeLayout: (out: any, layoutSpec: any, currentMatrix: any, parentMatrix: any, parentsizeAbsolute: any) => any;
    createLayoutSpec: (ax: any, ay: any, az: any) => {
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
        orientation: {
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
    createBaseComputedLayout: (x: any, y: any, z: any) => {
        size: {
            x: any;
            y: any;
            z: any;
        };
        matrix: any;
        shown: boolean;
        opacity: number;
    };
    computeOrientationFlexibly: (x: any, y: any, z: any, w: any, quat: any) => {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    createMatrix: () => any;
    FORMATS: {
        THREE: number;
        TWO: number;
    };
    SIZE_ABSOLUTE: number;
    SIZE_PROPORTIONAL: number;
    ATTRIBUTES: {
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
        orientation: {
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
    multiplyMatrices: (out: any, a: any, b: any) => any;
    transposeMatrix: (out: any, a: any) => any;
    copyMatrix: (out: any, m: any) => any;
    initializeTreeAttributes: (tree: any, container: any) => void;
    initializeNodeAttributes: (element: any, parent: any) => any;
    isZero: (num: any) => boolean;
};
export default _default;
