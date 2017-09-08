declare let SVGPoints: any;
declare let parseCssValueString: any;
declare let SVG_TYPES: {
    g: boolean;
    rect: boolean;
    polyline: boolean;
    polygon: boolean;
    path: boolean;
    line: boolean;
    ellipse: boolean;
    circle: boolean;
};
declare let SVG_POINT_NUMERIC_FIELDS: {
    cx: boolean;
    cy: boolean;
    r: boolean;
    rx: boolean;
    ry: boolean;
    x1: boolean;
    x2: boolean;
    x: boolean;
    y: boolean;
};
declare let SVG_POINT_COMMAND_FIELDS: {
    d: boolean;
    points: boolean;
};
declare let SVG_COMMAND_TYPES: {
    path: boolean;
    polyline: boolean;
    polygon: boolean;
};
declare function polyPointsStringToPoints(pointsString: any): any[];
declare function pointsToPolyString(points: any): string;
declare function pathToPoints(pathString: any): any;
declare function pointsToPath(pointsArray: any): any;
declare function manaToPoints(mana: any): any;
