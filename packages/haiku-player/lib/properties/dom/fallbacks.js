"use strict";
exports.__esModule = true;
var Layout3D_1 = require("./../../Layout3D");
var has_1 = require("./has");
var TEXT_CONTENT_FALLBACKS = {
    content: null
};
var LAYOUT_DEFAULTS = Layout3D_1["default"].createLayoutSpec(null, null, null);
var LAYOUT_3D_FALLBACKS = {
    "shown": LAYOUT_DEFAULTS.shown,
    "opacity": LAYOUT_DEFAULTS.opacity,
    "mount.x": LAYOUT_DEFAULTS.mount.x,
    "mount.y": LAYOUT_DEFAULTS.mount.y,
    "mount.z": LAYOUT_DEFAULTS.mount.z,
    "align.x": LAYOUT_DEFAULTS.align.x,
    "align.y": LAYOUT_DEFAULTS.align.y,
    "align.z": LAYOUT_DEFAULTS.align.z,
    "origin.x": LAYOUT_DEFAULTS.origin.x,
    "origin.y": LAYOUT_DEFAULTS.origin.y,
    "origin.z": LAYOUT_DEFAULTS.origin.z,
    "translation.x": LAYOUT_DEFAULTS.translation.x,
    "translation.y": LAYOUT_DEFAULTS.translation.y,
    "translation.z": LAYOUT_DEFAULTS.translation.z,
    "rotation.x": LAYOUT_DEFAULTS.rotation.x,
    "rotation.y": LAYOUT_DEFAULTS.rotation.y,
    "rotation.z": LAYOUT_DEFAULTS.rotation.z,
    "rotation.w": LAYOUT_DEFAULTS.rotation.w,
    "scale.x": LAYOUT_DEFAULTS.scale.x,
    "scale.y": LAYOUT_DEFAULTS.scale.y,
    "scale.z": LAYOUT_DEFAULTS.scale.z,
    "sizeAbsolute.x": LAYOUT_DEFAULTS.sizeAbsolute.x,
    "sizeAbsolute.y": LAYOUT_DEFAULTS.sizeAbsolute.y,
    "sizeAbsolute.z": LAYOUT_DEFAULTS.sizeAbsolute.z,
    "sizeProportional.x": LAYOUT_DEFAULTS.sizeProportional.x,
    "sizeProportional.y": LAYOUT_DEFAULTS.sizeProportional.y,
    "sizeProportional.z": LAYOUT_DEFAULTS.sizeProportional.z,
    "sizeDifferential.x": LAYOUT_DEFAULTS.sizeDifferential.x,
    "sizeDifferential.y": LAYOUT_DEFAULTS.sizeDifferential.y,
    "sizeDifferential.z": LAYOUT_DEFAULTS.sizeDifferential.z,
    "sizeMode.x": LAYOUT_DEFAULTS.sizeMode.x,
    "sizeMode.y": LAYOUT_DEFAULTS.sizeMode.y,
    "sizeMode.z": LAYOUT_DEFAULTS.sizeMode.z
};
var LAYOUT_2D_FALLBACKS = {
    "shown": LAYOUT_DEFAULTS.shown,
    "opacity": LAYOUT_DEFAULTS.opacity,
    "mount.x": LAYOUT_DEFAULTS.mount.x,
    "mount.y": LAYOUT_DEFAULTS.mount.y,
    "align.x": LAYOUT_DEFAULTS.align.x,
    "align.y": LAYOUT_DEFAULTS.align.y,
    "origin.x": LAYOUT_DEFAULTS.origin.x,
    "origin.y": LAYOUT_DEFAULTS.origin.y,
    "translation.x": LAYOUT_DEFAULTS.translation.x,
    "translation.y": LAYOUT_DEFAULTS.translation.y,
    "rotation.z": LAYOUT_DEFAULTS.rotation.z,
    "scale.x": LAYOUT_DEFAULTS.scale.x,
    "scale.y": LAYOUT_DEFAULTS.scale.y,
    "sizeAbsolute.x": LAYOUT_DEFAULTS.sizeAbsolute.x,
    "sizeAbsolute.y": LAYOUT_DEFAULTS.sizeAbsolute.y,
    "sizeProportional.x": LAYOUT_DEFAULTS.sizeProportional.x,
    "sizeProportional.y": LAYOUT_DEFAULTS.sizeProportional.y,
    "sizeDifferential.x": LAYOUT_DEFAULTS.sizeDifferential.x,
    "sizeDifferential.y": LAYOUT_DEFAULTS.sizeDifferential.y,
    "sizeMode.x": LAYOUT_DEFAULTS.sizeMode.x,
    "sizeMode.y": LAYOUT_DEFAULTS.sizeMode.y
};
var PRESENTATION_FALLBACKS = {
    alignmentBaseline: "",
    baselineShift: "",
    clipPath: "",
    clipRule: "",
    clip: "",
    colorInterpolationFilters: "",
    colorInterpolation: "",
    colorProfile: "",
    colorRendering: "",
    color: "",
    cursor: "",
    direction: "",
    display: "",
    dominantBaseline: "",
    enableBackground: "",
    fillOpacity: "",
    fillRule: "",
    fill: "",
    filter: "",
    floodColor: "",
    floodOpacity: "",
    fontFamily: "",
    fontSizeAdjust: "",
    fontSize: "",
    fontStretch: "",
    fontStyle: "",
    fontVariant: "",
    fontWeight: "",
    glyphOrientationHorizontal: "",
    glyphOrientationVertical: "",
    imageRendering: "",
    kerning: "",
    letterSpacing: "",
    lightingColor: "",
    markerEnd: "",
    markerMid: "",
    markerStart: "",
    mask: "",
    overflow: "",
    overflowX: "",
    overflowY: "",
    pointerEvents: "",
    shapeRendering: "",
    stopColor: "",
    stopOpacity: "",
    strokeDasharray: "",
    strokeDashoffset: "",
    strokeLinecap: "",
    strokeLinejoin: "",
    strokeMiterlimit: "",
    strokeOpacity: "",
    strokeWidth: "",
    stroke: "",
    textAnchor: "",
    textDecoration: "",
    textRendering: "",
    unicodeBidi: "",
    visibility: "",
    wordSpacing: "",
    writingMode: ""
};
var STYLE_FALLBACKS = {
    "style.alignmentBaseline": "",
    "style.background": "",
    "style.backgroundAttachment": "",
    "style.backgroundColor": "",
    "style.backgroundImage": "",
    "style.backgroundPosition": "",
    "style.backgroundRepeat": "",
    "style.baselineShift": "",
    "style.border": "",
    "style.borderBottom": "",
    "style.borderBottomColor": "",
    "style.borderBottomStyle": "",
    "style.borderBottomWidth": "",
    "style.borderColor": "",
    "style.borderLeft": "",
    "style.borderLeftColor": "",
    "style.borderLeftStyle": "",
    "style.borderLeftWidth": "",
    "style.borderRight": "",
    "style.borderRightColor": "",
    "style.borderRightStyle": "",
    "style.borderRightWidth": "",
    "style.borderStyle": "",
    "style.borderTop": "",
    "style.borderTopColor": "",
    "style.borderTopStyle": "",
    "style.borderTopWidth": "",
    "style.borderWidth": "",
    "style.clear": "",
    "style.clip": "",
    "style.clipPath": "",
    "style.clipRule": "",
    "style.color": "",
    "style.colorInterpolation": "",
    "style.colorInterpolationFilters": "",
    "style.colorProfile": "",
    "style.colorRendering": "",
    "style.cssFloat": "",
    "style.cursor": "",
    "style.direction": "",
    "style.display": "",
    "style.dominantBaseline": "",
    "style.enableBackground": "",
    "style.fill": "",
    "style.fillOpacity": "",
    "style.fillRule": "",
    "style.filter": "",
    "style.floodColor": "",
    "style.floodOpacity": "",
    "style.font": "",
    "style.fontFamily": "",
    "style.fontSize": "",
    "style.fontSizeAdjust": "",
    "style.fontStretch": "",
    "style.fontStyle": "",
    "style.fontVariant": "",
    "style.fontWeight": "",
    "style.glyphOrientationHorizontal": "",
    "style.glyphOrientationVertical": "",
    "style.height": "",
    "style.imageRendering": "",
    "style.kerning": "",
    "style.left": "",
    "style.letterSpacing": "",
    "style.lightingColor": "",
    "style.lineHeight": "",
    "style.listStyle": "",
    "style.listStyleImage": "",
    "style.listStylePosition": "",
    "style.listStyleType": "",
    "style.margin": "",
    "style.marginBottom": "",
    "style.marginLeft": "",
    "style.marginRight": "",
    "style.marginTop": "",
    "style.markerEnd": "",
    "style.markerMid": "",
    "style.markerStart": "",
    "style.mask": "",
    "style.opacity": "",
    "style.overflow": "",
    "style.overflowX": "hidden",
    "style.overflowY": "hidden",
    "style.padding": "",
    "style.paddingBottom": "",
    "style.paddingLeft": "",
    "style.paddingRight": "",
    "style.paddingTop": "",
    "style.pageBreakAfter": "",
    "style.pageBreakBefore": "",
    "style.pointerEvents": "",
    "style.position": "",
    "style.shapeRendering": "",
    "style.stopColor": "",
    "style.stopOpacity": "",
    "style.stroke": "",
    "style.strokeDasharray": "",
    "style.strokeDashoffset": "",
    "style.strokeLinecap": "",
    "style.strokeLinejoin": "",
    "style.strokeMiterlimit": "",
    "style.strokeOpacity": "",
    "style.strokeWidth": "",
    "style.textAlign": "",
    "style.textAnchor": "",
    "style.textDecoration": "",
    "style.textDecorationBlink": "",
    "style.textDecorationLineThrough": "",
    "style.textDecorationNone": "",
    "style.textDecorationOverline": "",
    "style.textDecorationUnderline": "",
    "style.textIndent": "",
    "style.textRendering": "",
    "style.textTransform": "",
    "style.top": "",
    "style.unicodeBidi": "",
    "style.verticalAlign": "",
    "style.visibility": "",
    "style.width": "",
    "style.wordSpacing": "",
    "style.writingMode": "",
    "style.zIndex": 1,
    "style.WebkitTapHighlightColor": "rgba(0,0,0,0)"
};
var FILTER_FALLBACKS = {
    x: "",
    y: "",
    width: "",
    height: "",
    filterRes: "",
    filterUnits: "",
    primitiveUnits: ""
};
var HTML_STYLE_SHORTHAND_FALLBACKS = {
    backgroundColor: ""
};
var CONTROL_FLOW_FALLBACKS = {
    "controlFlow.repeat": null,
    "controlFlow.placeholder": null
};
exports["default"] = {
    "missing-glyph": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "a": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS, STYLE_FALLBACKS),
    "abbr": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "acronym": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "address": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "altGlyph": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "altGlyphDef": has_1["default"](),
    "altGlyphItem": has_1["default"](),
    "animate": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "animateColor": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "animateMotion": has_1["default"](),
    "animateTransform": has_1["default"](),
    "applet": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "area": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "article": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "aside": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "audio": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "b": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "base": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "basefont": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "bdi": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "bdo": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "big": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "blockquote": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "body": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "br": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "button": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "canvas": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "caption": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "center": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "circle": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "cite": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "clipPath": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "code": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "col": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "colgroup": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "color-profile": has_1["default"](),
    "command": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "cursor": has_1["default"](),
    "datalist": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "dd": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "defs": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "del": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "desc": has_1["default"](),
    "details": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "dfn": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "dir": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "discard": has_1["default"](),
    "div": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "dl": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "dt": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "ellipse": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "em": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "embed": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "feBlend": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feColorMatrix": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feComponentTransfer": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feComposite": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feConvolveMatrix": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feDiffuseLighting": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feDisplacementMap": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feDistantLight": has_1["default"](),
    "feDropShadow": has_1["default"](),
    "feFlood": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feFuncA": has_1["default"](),
    "feFuncB": has_1["default"](),
    "feFuncG": has_1["default"](),
    "feFuncR": has_1["default"](),
    "feGaussianBlur": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feImage": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feMerge": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feMergeNode": has_1["default"](),
    "feMorphology": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feOffset": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "fePointLight": has_1["default"](),
    "feSpecularLighting": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feTile": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "feTurbulence": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "fieldset": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "figcaption": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "figure": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "filter": has_1["default"](LAYOUT_3D_FALLBACKS, FILTER_FALLBACKS),
    "font-face": has_1["default"](),
    "font-face-format": has_1["default"](),
    "font-face-name": has_1["default"](),
    "font-face-src": has_1["default"](),
    "font-face-uri": has_1["default"](),
    "font": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS, STYLE_FALLBACKS),
    "footer": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "foreignObject": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "form": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "frame": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "frameset": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "g": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "glyph": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "glyphRef": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "h1": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "h2": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "h3": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "h4": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "h5": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "h6": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "hatch": has_1["default"](),
    "hatchpath": has_1["default"](),
    "head": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "header": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "hgroup": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "hkern": has_1["default"](),
    "hr": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "html": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "i": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "iframe": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "image": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "img": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "input": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "ins": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "kbd": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "keygen": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "label": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "legend": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "li": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "line": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "linearGradient": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "link": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "map": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "mark": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "marker": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "mask": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "menu": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "mesh": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS),
    "meshgradient": has_1["default"](),
    "meshpatch": has_1["default"](),
    "meshrow": has_1["default"](),
    "meta": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "metadata": has_1["default"](),
    "meter": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "mpath": has_1["default"](),
    "nav": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "noframes": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "noscript": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "object": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "ol": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "optgroup": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "option": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "output": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "p": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "param": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "path": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "pattern": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "polygon": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "polyline": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "pre": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "progress": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "q": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "radialGradient": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "rect": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "rp": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "rt": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "ruby": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "s": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "samp": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "script": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "section": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "select": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "set": has_1["default"](),
    "small": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "solidcolor": has_1["default"](),
    "source": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "span": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "stop": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "strike": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "strong": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "style": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "sub": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "summary": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "sup": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "svg": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS, STYLE_FALLBACKS),
    "switch": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "symbol": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "table": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "tbody": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "td": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "text": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "textarea": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "textPath": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "tfoot": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "th": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "thead": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "time": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "title": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "tr": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "track": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "tref": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "tspan": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
    "tt": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "u": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, TEXT_CONTENT_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "ul": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "unknown": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS),
    "us": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
    "use": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS),
    "var": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "video": has_1["default"](HTML_STYLE_SHORTHAND_FALLBACKS, CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
    "view": has_1["default"](),
    "vkern": has_1["default"](),
    "wb": has_1["default"](CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS)
};
//# sourceMappingURL=fallbacks.js.map