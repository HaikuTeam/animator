var computeMatrix = require("./layout/computeMatrix");
var computeRotationFlexibly = require("./layout/computeRotationFlexibly");
var computeSize = require("./layout/computeSize");
var ELEMENTS_2D = {
    circle: true,
    ellipse: true,
    foreignObject: true,
    g: true,
    image: true,
    line: true,
    mesh: true,
    path: true,
    polygon: true,
    polyline: true,
    rect: true,
    svg: true,
    "switch": true,
    symbol: true,
    text: true,
    textPath: true,
    tspan: true,
    unknown: true,
    use: true
};
var SIZE_PROPORTIONAL = 0;
var SIZE_ABSOLUTE = 1;
var DEFAULT_DEPTH = 0;
var IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var FORMATS = {
    THREE: 3,
    TWO: 2
};
function initializeNodeAttributes(element, parent) {
    if (!element.attributes)
        element.attributes = {};
    if (!element.attributes.style)
        element.attributes.style = {};
    if (!element.layout) {
        element.layout = createLayoutSpec();
        element.layout.matrix = createMatrix();
        element.layout.format = ELEMENTS_2D[element.elementName]
            ? FORMATS.TWO
            : FORMATS.THREE;
    }
    return element;
}
function initializeTreeAttributes(tree, container) {
    if (!tree || typeof tree === "string")
        return;
    initializeNodeAttributes(tree, container);
    tree.__parent = container;
    if (!tree.children)
        return;
    if (tree.children.length < 1)
        return;
    for (var i = 0; i < tree.children.length; i++) {
        initializeTreeAttributes(tree.children[i], tree);
    }
}
function createLayoutSpec(ax, ay, az) {
    return {
        shown: true,
        opacity: 1.0,
        mount: { x: ax || 0, y: ay || 0, z: az || 0 },
        align: { x: ax || 0, y: ay || 0, z: az || 0 },
        origin: { x: ax || 0, y: ay || 0, z: az || 0 },
        translation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 0 },
        scale: { x: 1, y: 1, z: 1 },
        sizeMode: {
            x: SIZE_PROPORTIONAL,
            y: SIZE_PROPORTIONAL,
            z: SIZE_PROPORTIONAL
        },
        sizeProportional: { x: 1, y: 1, z: 1 },
        sizeDifferential: { x: 0, y: 0, z: 0 },
        sizeAbsolute: { x: 0, y: 0, z: 0 }
    };
}
function createMatrix() {
    return copyMatrix([], IDENTITY);
}
function copyMatrix(out, m) {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4];
    out[5] = m[5];
    out[6] = m[6];
    out[7] = m[7];
    out[8] = m[8];
    out[9] = m[9];
    out[10] = m[10];
    out[11] = m[11];
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
    return out;
}
function multiplyMatrices(out, a, b) {
    out[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    out[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    out[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    out[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
    out[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    out[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    out[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    out[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
    out[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    out[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    out[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    out[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
    out[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    out[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    out[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    out[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
    return out;
}
function transposeMatrix(out, a) {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
    return out;
}
function multiplyArrayOfMatrices(arrayOfMatrices) {
    var product = createMatrix();
    for (var i = 0; i < arrayOfMatrices.length; i++) {
        product = multiplyMatrices([], product, arrayOfMatrices[i]);
    }
    return product;
}
function isZero(num) {
    return num > -0.000001 && num < 0.000001;
}
function createBaseComputedLayout(x, y, z) {
    if (!x)
        x = 0;
    if (!y)
        y = 0;
    if (!z)
        z = 0;
    return {
        size: { x: x, y: y, z: z },
        matrix: createMatrix(),
        shown: true,
        opacity: 1.0
    };
}
function computeLayout(out, layoutSpec, currentMatrix, parentMatrix, parentsizeAbsolute) {
    if (!parentsizeAbsolute)
        parentsizeAbsolute = { x: 0, y: 0, z: 0 };
    if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
        parentsizeAbsolute.z = DEFAULT_DEPTH;
    }
    var size = computeSize({}, layoutSpec, layoutSpec.sizeMode, parentsizeAbsolute);
    var matrix = computeMatrix([], out, layoutSpec, currentMatrix, size, parentMatrix, parentsizeAbsolute);
    out.size = size;
    out.matrix = matrix;
    out.shown = layoutSpec.shown;
    out.opacity = layoutSpec.opacity;
    return out;
}
module.exports = {
    computeMatrix: computeMatrix,
    multiplyArrayOfMatrices: multiplyArrayOfMatrices,
    computeLayout: computeLayout,
    createLayoutSpec: createLayoutSpec,
    createBaseComputedLayout: createBaseComputedLayout,
    computeRotationFlexibly: computeRotationFlexibly,
    createMatrix: createMatrix,
    FORMATS: FORMATS,
    SIZE_ABSOLUTE: SIZE_ABSOLUTE,
    SIZE_PROPORTIONAL: SIZE_PROPORTIONAL,
    ATTRIBUTES: createLayoutSpec(),
    multiplyMatrices: multiplyMatrices,
    transposeMatrix: transposeMatrix,
    copyMatrix: copyMatrix,
    initializeTreeAttributes: initializeTreeAttributes,
    initializeNodeAttributes: initializeNodeAttributes,
    isZero: isZero
};
