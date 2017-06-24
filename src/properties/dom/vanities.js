var clone = require('lodash.clone')
var Layout3D = require('./../../Layout3D')

/**
 * 'Vanities' are functions that provide special handling for applied properties.
 * So for example, if a component wants to apply 'foo.bar'=3 to a <div> in its template,
 * the player/interpreter will look in the vanities dictionary to see if there is a
 * vanity under vanities['div']['foo.bar'], and if so, pass the value 3 into that function.
 * The function, in turn, knows how to apply that value to the virtual element passed into
 * it. In the future these will be defined by components themselves as inputs; for now,
 * we are keeping a whitelist of possible vanity handlers which the renderer directly
 * loads and calls.
 * {
 *   div: {
 *     'foo.bar': function()...
 *   }
 * }
 */

// Just a utility function for populating these objects
function has () {
  var obj = {}
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    for (var name in arg) {
      var fn = arg[name]
      obj[name] = fn
    }
  }
  return obj
}

var LAYOUT_3D_VANITIES = {
  // Layout has a couple of special values that relate to display
  // but not to position:

  'shown': function (name, element, value) {
    element.layout.shown = value
  },
  'opacity': function (name, element, value) {
    element.layout.opacity = value
  },

  // Rotation is a special snowflake since it needs to account for
  // the w-component of the quaternion and carry it

  'rotation.x': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = value
    var y = rotation.y
    var z = rotation.z
    var w = rotation.w
    element.layout.rotation = Layout3D.computeRotationFlexibly(x, y, z, w, rotation)
  },
  'rotation.y': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = rotation.x
    var y = value
    var z = rotation.z
    var w = rotation.w
    element.layout.rotation = Layout3D.computeRotationFlexibly(x, y, z, w, rotation)
  },
  'rotation.z': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = rotation.x
    var y = rotation.y
    var z = value
    var w = rotation.w
    element.layout.rotation = Layout3D.computeRotationFlexibly(x, y, z, w, rotation)
  },
  'rotation.w': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = rotation.x
    var y = rotation.y
    var z = rotation.z
    var w = value
    element.layout.rotation = Layout3D.computeRotationFlexibly(x, y, z, w, rotation)
  },

  // If you really want to set what we call 'position' then
  // we do so on the element's attributes; this is mainly to
  // enable the x/y positioning system for SVG elements

  'position.x': function (name, element, value) {
    element.attributes.x = value
  },
  'position.y': function (name, element, value) {
    element.attributes.y = value
  },

  // Everything that follows is a standard 3-coord component
  // relating to the element's position in space

  'align.x': function (name, element, value) {
    element.layout.align.x = value
  },
  'align.y': function (name, element, value) {
    element.layout.align.y = value
  },
  'align.z': function (name, element, value) {
    element.layout.align.z = value
  },
  'mount.x': function (name, element, value) {
    element.layout.mount.x = value
  },
  'mount.y': function (name, element, value) {
    element.layout.mount.y = value
  },
  'mount.z': function (name, element, value) {
    element.layout.mount.z = value
  },
  'origin.x': function (name, element, value) {
    element.layout.origin.x = value
  },
  'origin.y': function (name, element, value) {
    element.layout.origin.y = value
  },
  'origin.z': function (name, element, value) {
    element.layout.origin.z = value
  },
  'scale.x': function (name, element, value) {
    element.layout.scale.x = value
  },
  'scale.y': function (name, element, value) {
    element.layout.scale.y = value
  },
  'scale.z': function (name, element, value) {
    element.layout.scale.z = value
  },
  'sizeAbsolute.x': function (name, element, value) {
    element.layout.sizeAbsolute.x = value
  },
  'sizeAbsolute.y': function (name, element, value) {
    element.layout.sizeAbsolute.y = value
  },
  'sizeAbsolute.z': function (name, element, value) {
    element.layout.sizeAbsolute.z = value
  },
  'sizeDifferential.x': function (name, element, value) {
    element.layout.sizeDifferential.x = value
  },
  'sizeDifferential.y': function (name, element, value) {
    element.layout.sizeDifferential.y = value
  },
  'sizeDifferential.z': function (name, element, value) {
    element.layout.sizeDifferential.z = value
  },
  'sizeMode.x': function (name, element, value) {
    element.layout.sizeMode.x = value
  },
  'sizeMode.y': function (name, element, value) {
    element.layout.sizeMode.y = value
  },
  'sizeMode.z': function (name, element, value) {
    element.layout.sizeMode.z = value
  },
  'sizeProportional.x': function (name, element, value) {
    element.layout.sizeProportional.x = value
  },
  'sizeProportional.y': function (name, element, value) {
    element.layout.sizeProportional.y = value
  },
  'sizeProportional.z': function (name, element, value) {
    element.layout.sizeProportional.z = value
  },
  'translation.x': function (name, element, value) {
    element.layout.translation.x = value
  },
  'translation.y': function (name, element, value) {
    element.layout.translation.y = value
  },
  'translation.z': function (name, element, value) {
    element.layout.translation.z = value
  }
}

var LAYOUT_2D_VANITIES = clone(LAYOUT_3D_VANITIES)

var STYLE_VANITIES = {
  'style.alignContent': function (name, element, value) { element.attributes.style.alignContent = value },
  'style.alignItems': function (name, element, value) { element.attributes.style.alignItems = value },
  'style.alignmentBaseline': function (name, element, value) { element.attributes.style.alignmentBaseline = value },
  'style.alignSelf': function (name, element, value) { element.attributes.style.alignSelf = value },
  'style.all': function (name, element, value) { element.attributes.style.all = value },
  'style.animation': function (name, element, value) { element.attributes.style.animation = value },
  'style.animationDelay': function (name, element, value) { element.attributes.style.animationDelay = value },
  'style.animationDirection': function (name, element, value) { element.attributes.style.animationDirection = value },
  'style.animationDuration': function (name, element, value) { element.attributes.style.animationDuration = value },
  'style.animationFillMode': function (name, element, value) { element.attributes.style.animationFillMode = value },
  'style.animationIterationCount': function (name, element, value) { element.attributes.style.animationIterationCount = value },
  'style.animationName': function (name, element, value) { element.attributes.style.animationName = value },
  'style.animationPlayState': function (name, element, value) { element.attributes.style.animationPlayState = value },
  'style.animationTimingFunction': function (name, element, value) { element.attributes.style.animationTimingFunction = value },
  'style.appearance': function (name, element, value) { element.attributes.style.appearance = value },
  'style.azimuth': function (name, element, value) { element.attributes.style.azimuth = value },
  'style.backfaceVisibility': function (name, element, value) { element.attributes.style.backfaceVisibility = value },
  'style.background': function (name, element, value) { element.attributes.style.background = value },
  'style.backgroundAttachment': function (name, element, value) { element.attributes.style.backgroundAttachment = value },
  'style.backgroundBlendMode': function (name, element, value) { element.attributes.style.backgroundBlendMode = value },
  'style.backgroundClip': function (name, element, value) { element.attributes.style.backgroundClip = value },
  'style.backgroundColor': function (name, element, value) { element.attributes.style.backgroundColor = value },
  'style.backgroundimage': function (name, element, value) { element.attributes.style.backgroundimage = value },
  'style.backgroundorigin': function (name, element, value) { element.attributes.style.backgroundorigin = value },
  'style.backgroundposition': function (name, element, value) { element.attributes.style.backgroundposition = value },
  'style.backgroundRepeat': function (name, element, value) { element.attributes.style.backgroundRepeat = value },
  'style.backgroundSize': function (name, element, value) { element.attributes.style.backgroundSize = value },
  'style.baselineShift': function (name, element, value) { element.attributes.style.baselineShift = value },
  'style.bookmarkLabel': function (name, element, value) { element.attributes.style.bookmarkLabel = value },
  'style.bookmarkLevel': function (name, element, value) { element.attributes.style.bookmarkLevel = value },
  'style.bookmarkState': function (name, element, value) { element.attributes.style.bookmarkState = value },
  'style.border': function (name, element, value) { element.attributes.style.border = value },
  'style.borderBottom': function (name, element, value) { element.attributes.style.borderBottom = value },
  'style.borderBottomColor': function (name, element, value) { element.attributes.style.borderBottomColor = value },
  'style.borderBottomLeftRadius': function (name, element, value) { element.attributes.style.borderBottomLeftRadius = value },
  'style.borderBottomRightRadius': function (name, element, value) { element.attributes.style.borderBottomRightRadius = value },
  'style.borderBottomStyle': function (name, element, value) { element.attributes.style.borderBottomStyle = value },
  'style.borderBottomWidth': function (name, element, value) { element.attributes.style.borderBottomWidth = value },
  'style.borderBoundary': function (name, element, value) { element.attributes.style.borderBoundary = value },
  'style.borderCollapse': function (name, element, value) { element.attributes.style.borderCollapse = value },
  'style.borderColor': function (name, element, value) { element.attributes.style.borderColor = value },
  'style.borderImage': function (name, element, value) { element.attributes.style.borderImage = value },
  'style.borderImageOutset': function (name, element, value) { element.attributes.style.borderImageOutset = value },
  'style.borderImageRepeat': function (name, element, value) { element.attributes.style.borderImageRepeat = value },
  'style.borderImageSlice': function (name, element, value) { element.attributes.style.borderImageSlice = value },
  'style.borderImageSource': function (name, element, value) { element.attributes.style.borderImageSource = value },
  'style.borderImageWidth': function (name, element, value) { element.attributes.style.borderImageWidth = value },
  'style.borderLeft': function (name, element, value) { element.attributes.style.borderLeft = value },
  'style.borderLeftColor': function (name, element, value) { element.attributes.style.borderLeftColor = value },
  'style.borderLeftStyle': function (name, element, value) { element.attributes.style.borderLeftStyle = value },
  'style.borderLeftWidth': function (name, element, value) { element.attributes.style.borderLeftWidth = value },
  'style.borderRadius': function (name, element, value) { element.attributes.style.borderRadius = value },
  'style.borderRight': function (name, element, value) { element.attributes.style.borderRight = value },
  'style.borderRightColor': function (name, element, value) { element.attributes.style.borderRightColor = value },
  'style.borderRightStyle': function (name, element, value) { element.attributes.style.borderRightStyle = value },
  'style.borderRightWidth': function (name, element, value) { element.attributes.style.borderRightWidth = value },
  'style.borderSpacing': function (name, element, value) { element.attributes.style.borderSpacing = value },
  'style.borderStyle': function (name, element, value) { element.attributes.style.borderStyle = value },
  'style.borderTop': function (name, element, value) { element.attributes.style.borderTop = value },
  'style.borderTopColor': function (name, element, value) { element.attributes.style.borderTopColor = value },
  'style.borderTopLeftRadius': function (name, element, value) { element.attributes.style.borderTopLeftRadius = value },
  'style.borderTopRightRadius': function (name, element, value) { element.attributes.style.borderTopRightRadius = value },
  'style.borderTopStyle': function (name, element, value) { element.attributes.style.borderTopStyle = value },
  'style.borderTopWidth': function (name, element, value) { element.attributes.style.borderTopWidth = value },
  'style.borderWidth': function (name, element, value) { element.attributes.style.borderWidth = value },
  'style.bottom': function (name, element, value) { element.attributes.style.bottom = value },
  'style.boxDecorationBreak': function (name, element, value) { element.attributes.style.boxDecorationBreak = value },
  'style.boxShadow': function (name, element, value) { element.attributes.style.boxShadow = value },
  'style.boxSizing': function (name, element, value) { element.attributes.style.boxSizing = value },
  'style.boxSnap': function (name, element, value) { element.attributes.style.boxSnap = value },
  'style.boxSuppress': function (name, element, value) { element.attributes.style.boxSuppress = value },
  'style.breakAfter': function (name, element, value) { element.attributes.style.breakAfter = value },
  'style.breakBefore': function (name, element, value) { element.attributes.style.breakBefore = value },
  'style.breakInside': function (name, element, value) { element.attributes.style.breakInside = value },
  'style.captionSide': function (name, element, value) { element.attributes.style.captionSide = value },
  'style.caret': function (name, element, value) { element.attributes.style.caret = value },
  'style.caretAnimation': function (name, element, value) { element.attributes.style.caretAnimation = value },
  'style.caretColor': function (name, element, value) { element.attributes.style.caretColor = value },
  'style.caretShape': function (name, element, value) { element.attributes.style.caretShape = value },
  'style.chains': function (name, element, value) { element.attributes.style.chains = value },
  'style.clear': function (name, element, value) { element.attributes.style.clear = value },
  'style.clip': function (name, element, value) { element.attributes.style.clip = value },
  'style.clipPath': function (name, element, value) { element.attributes.style.clipPath = value },
  'style.clipRule': function (name, element, value) { element.attributes.style.clipRule = value },
  'style.color': function (name, element, value) { element.attributes.style.color = value },
  'style.colorAdjust': function (name, element, value) { element.attributes.style.colorAdjust = value },
  'style.colorInterpolation': function (name, element, value) { element.attributes.style.colorInterpolation = value },
  'style.colorInterpolationFilters': function (name, element, value) { element.attributes.style.colorInterpolationFilters = value },
  'style.colorProfile': function (name, element, value) { element.attributes.style.colorProfile = value },
  'style.colorRendering': function (name, element, value) { element.attributes.style.colorRendering = value },
  'style.columnCount': function (name, element, value) { element.attributes.style.columnCount = value },
  'style.columnFill': function (name, element, value) { element.attributes.style.columnFill = value },
  'style.columnGap': function (name, element, value) { element.attributes.style.columnGap = value },
  'style.columnRule': function (name, element, value) { element.attributes.style.columnRule = value },
  'style.columnRuleColor': function (name, element, value) { element.attributes.style.columnRuleColor = value },
  'style.columnRuleStyle': function (name, element, value) { element.attributes.style.columnRuleStyle = value },
  'style.columnRuleWidth': function (name, element, value) { element.attributes.style.columnRuleWidth = value },
  'style.columns': function (name, element, value) { element.attributes.style.columns = value },
  'style.columnSpan': function (name, element, value) { element.attributes.style.columnSpan = value },
  'style.columnWidth': function (name, element, value) { element.attributes.style.columnWidth = value },
  'style.content': function (name, element, value) { element.attributes.style.content = value },
  'style.continue': function (name, element, value) { element.attributes.style.continue = value },
  'style.counterIncrement': function (name, element, value) { element.attributes.style.counterIncrement = value },
  'style.counterReset': function (name, element, value) { element.attributes.style.counterReset = value },
  'style.counterSet': function (name, element, value) { element.attributes.style.counterSet = value },
  'style.cue': function (name, element, value) { element.attributes.style.cue = value },
  'style.cueAfter': function (name, element, value) { element.attributes.style.cueAfter = value },
  'style.cueBefore': function (name, element, value) { element.attributes.style.cueBefore = value },
  'style.cursor': function (name, element, value) { element.attributes.style.cursor = value },
  'style.direction': function (name, element, value) { element.attributes.style.direction = value },
  'style.display': function (name, element, value) { element.attributes.style.display = value },
  'style.dominantBaseline': function (name, element, value) { element.attributes.style.dominantBaseline = value },
  'style.elevation': function (name, element, value) { element.attributes.style.elevation = value },
  'style.emptyCells': function (name, element, value) { element.attributes.style.emptyCells = value },
  'style.enableBackground': function (name, element, value) { element.attributes.style.enableBackground = value },
  'style.fill': function (name, element, value) { element.attributes.style.fill = value },
  'style.fillOpacity': function (name, element, value) { element.attributes.style.fillOpacity = value },
  'style.fillRule': function (name, element, value) { element.attributes.style.fillRule = value },
  'style.filter': function (name, element, value) { element.attributes.style.filter = value },
  'style.flex': function (name, element, value) { element.attributes.style.flex = value },
  'style.flexBasis': function (name, element, value) { element.attributes.style.flexBasis = value },
  'style.flexDirection': function (name, element, value) { element.attributes.style.flexDirection = value },
  'style.flexFlow': function (name, element, value) { element.attributes.style.flexFlow = value },
  'style.flexGrow': function (name, element, value) { element.attributes.style.flexGrow = value },
  'style.flexShrink': function (name, element, value) { element.attributes.style.flexShrink = value },
  'style.flexWrap': function (name, element, value) { element.attributes.style.flexWrap = value },
  'style.float': function (name, element, value) { element.attributes.style.float = value },
  'style.floatDefer': function (name, element, value) { element.attributes.style.floatDefer = value },
  'style.floatOffset': function (name, element, value) { element.attributes.style.floatOffset = value },
  'style.floatReference': function (name, element, value) { element.attributes.style.floatReference = value },
  'style.floodColor': function (name, element, value) { element.attributes.style.floodColor = value },
  'style.floodOpacity': function (name, element, value) { element.attributes.style.floodOpacity = value },
  'style.flow': function (name, element, value) { element.attributes.style.flow = value },
  'style.flowFrom': function (name, element, value) { element.attributes.style.flowFrom = value },
  'style.flowInto': function (name, element, value) { element.attributes.style.flowInto = value },
  'style.font': function (name, element, value) { element.attributes.style.font = value },
  'style.fontFamily': function (name, element, value) { element.attributes.style.fontFamily = value },
  'style.fontFeatureSettings': function (name, element, value) { element.attributes.style.fontFeatureSettings = value },
  'style.fontKerning': function (name, element, value) { element.attributes.style.fontKerning = value },
  'style.fontLanguageOverride': function (name, element, value) { element.attributes.style.fontLanguageOverride = value },
  'style.fontSize': function (name, element, value) { element.attributes.style.fontSize = value },
  'style.fontSizeAdjust': function (name, element, value) { element.attributes.style.fontSizeAdjust = value },
  'style.fontStretch': function (name, element, value) { element.attributes.style.fontStretch = value },
  'style.fontStyle': function (name, element, value) { element.attributes.style.fontStyle = value },
  'style.fontSynthesis': function (name, element, value) { element.attributes.style.fontSynthesis = value },
  'style.fontVariant': function (name, element, value) { element.attributes.style.fontVariant = value },
  'style.fontVariantAlternates': function (name, element, value) { element.attributes.style.fontVariantAlternates = value },
  'style.fontVariantCaps': function (name, element, value) { element.attributes.style.fontVariantCaps = value },
  'style.fontVariantEastAsian': function (name, element, value) { element.attributes.style.fontVariantEastAsian = value },
  'style.fontVariantLigatures': function (name, element, value) { element.attributes.style.fontVariantLigatures = value },
  'style.fontVariantNumeric': function (name, element, value) { element.attributes.style.fontVariantNumeric = value },
  'style.fontVariantPosition': function (name, element, value) { element.attributes.style.fontVariantPosition = value },
  'style.fontWeight': function (name, element, value) { element.attributes.style.fontWeight = value },
  'style.footnoteDisplay': function (name, element, value) { element.attributes.style.footnoteDisplay = value },
  'style.footnotePolicy': function (name, element, value) { element.attributes.style.footnotePolicy = value },
  'style.glyphOrientationHorizontal': function (name, element, value) { element.attributes.style.glyphOrientationHorizontal = value },
  'style.glyphOrientationVertical': function (name, element, value) { element.attributes.style.glyphOrientationVertical = value },
  'style.grid': function (name, element, value) { element.attributes.style.grid = value },
  'style.gridArea': function (name, element, value) { element.attributes.style.gridArea = value },
  'style.gridAutoColumns': function (name, element, value) { element.attributes.style.gridAutoColumns = value },
  'style.gridAutoFlow': function (name, element, value) { element.attributes.style.gridAutoFlow = value },
  'style.gridAutoRows': function (name, element, value) { element.attributes.style.gridAutoRows = value },
  'style.gridColumn': function (name, element, value) { element.attributes.style.gridColumn = value },
  'style.gridColumnEnd': function (name, element, value) { element.attributes.style.gridColumnEnd = value },
  'style.gridColumnGap': function (name, element, value) { element.attributes.style.gridColumnGap = value },
  'style.gridColumnStart': function (name, element, value) { element.attributes.style.gridColumnStart = value },
  'style.gridGap': function (name, element, value) { element.attributes.style.gridGap = value },
  'style.gridRow': function (name, element, value) { element.attributes.style.gridRow = value },
  'style.gridRowEnd': function (name, element, value) { element.attributes.style.gridRowEnd = value },
  'style.gridRowGap': function (name, element, value) { element.attributes.style.gridRowGap = value },
  'style.gridRowStart': function (name, element, value) { element.attributes.style.gridRowStart = value },
  'style.gridTemplate': function (name, element, value) { element.attributes.style.gridTemplate = value },
  'style.gridTemplateAreas': function (name, element, value) { element.attributes.style.gridTemplateAreas = value },
  'style.gridTemplateColumns': function (name, element, value) { element.attributes.style.gridTemplateColumns = value },
  'style.gridTemplateRows': function (name, element, value) { element.attributes.style.gridTemplateRows = value },
  'style.hangingPunctuation': function (name, element, value) { element.attributes.style.hangingPunctuation = value },
  'style.height': function (name, element, value) { element.attributes.style.height = value },
  'style.hyphenateCharacter': function (name, element, value) { element.attributes.style.hyphenateCharacter = value },
  'style.hyphenateLimitChars': function (name, element, value) { element.attributes.style.hyphenateLimitChars = value },
  'style.hyphenateLimitLast': function (name, element, value) { element.attributes.style.hyphenateLimitLast = value },
  'style.hyphenateLimitLines': function (name, element, value) { element.attributes.style.hyphenateLimitLines = value },
  'style.hyphenateLimitZone': function (name, element, value) { element.attributes.style.hyphenateLimitZone = value },
  'style.hyphens': function (name, element, value) { element.attributes.style.hyphens = value },
  'style.imageOrientation': function (name, element, value) { element.attributes.style.imageOrientation = value },
  'style.imageRendering': function (name, element, value) { element.attributes.style.imageRendering = value },
  'style.imageResolution': function (name, element, value) { element.attributes.style.imageResolution = value },
  'style.initialLetter': function (name, element, value) { element.attributes.style.initialLetter = value },
  'style.initialLetterAlign': function (name, element, value) { element.attributes.style.initialLetterAlign = value },
  'style.initialLetterWrap': function (name, element, value) { element.attributes.style.initialLetterWrap = value },
  'style.isolation': function (name, element, value) { element.attributes.style.isolation = value },
  'style.justifyContent': function (name, element, value) { element.attributes.style.justifyContent = value },
  'style.justifyItems': function (name, element, value) { element.attributes.style.justifyItems = value },
  'style.justifySelf': function (name, element, value) { element.attributes.style.justifySelf = value },
  'style.kerning': function (name, element, value) { element.attributes.style.kerning = value },
  'style.left': function (name, element, value) { element.attributes.style.left = value },
  'style.letterSpacing': function (name, element, value) { element.attributes.style.letterSpacing = value },
  'style.lightingColor': function (name, element, value) { element.attributes.style.lightingColor = value },
  'style.lineBreak': function (name, element, value) { element.attributes.style.lineBreak = value },
  'style.lineGrid': function (name, element, value) { element.attributes.style.lineGrid = value },
  'style.lineHeight': function (name, element, value) { element.attributes.style.lineHeight = value },
  'style.lineSnap': function (name, element, value) { element.attributes.style.lineSnap = value },
  'style.listStyle': function (name, element, value) { element.attributes.style.listStyle = value },
  'style.listStyleImage': function (name, element, value) { element.attributes.style.listStyleImage = value },
  'style.listStylePosition': function (name, element, value) { element.attributes.style.listStylePosition = value },
  'style.listStyleType': function (name, element, value) { element.attributes.style.listStyleType = value },
  'style.margin': function (name, element, value) { element.attributes.style.margin = value },
  'style.marginBottom': function (name, element, value) { element.attributes.style.marginBottom = value },
  'style.marginLeft': function (name, element, value) { element.attributes.style.marginLeft = value },
  'style.marginRight': function (name, element, value) { element.attributes.style.marginRight = value },
  'style.marginTop': function (name, element, value) { element.attributes.style.marginTop = value },
  'style.marker': function (name, element, value) { element.attributes.style.marker = value },
  'style.markerEnd': function (name, element, value) { element.attributes.style.markerEnd = value },
  'style.markerKnockoutLeft': function (name, element, value) { element.attributes.style.markerKnockoutLeft = value },
  'style.markerKnockoutRight': function (name, element, value) { element.attributes.style.markerKnockoutRight = value },
  'style.markerMid': function (name, element, value) { element.attributes.style.markerMid = value },
  'style.markerPattern': function (name, element, value) { element.attributes.style.markerPattern = value },
  'style.markerSegment': function (name, element, value) { element.attributes.style.markerSegment = value },
  'style.markerSide': function (name, element, value) { element.attributes.style.markerSide = value },
  'style.markerStart': function (name, element, value) { element.attributes.style.markerStart = value },
  'style.marqueeDirection': function (name, element, value) { element.attributes.style.marqueeDirection = value },
  'style.marqueeLoop': function (name, element, value) { element.attributes.style.marqueeLoop = value },
  'style.marqueeSpeed': function (name, element, value) { element.attributes.style.marqueeSpeed = value },
  'style.marqueeStyle': function (name, element, value) { element.attributes.style.marqueeStyle = value },
  'style.mask': function (name, element, value) { element.attributes.style.mask = value },
  'style.maskBorder': function (name, element, value) { element.attributes.style.maskBorder = value },
  'style.maskBorderMode': function (name, element, value) { element.attributes.style.maskBorderMode = value },
  'style.maskBorderOutset': function (name, element, value) { element.attributes.style.maskBorderOutset = value },
  'style.maskBorderRepeat': function (name, element, value) { element.attributes.style.maskBorderRepeat = value },
  'style.maskBorderSlice': function (name, element, value) { element.attributes.style.maskBorderSlice = value },
  'style.maskBorderSource': function (name, element, value) { element.attributes.style.maskBorderSource = value },
  'style.maskBorderWidth': function (name, element, value) { element.attributes.style.maskBorderWidth = value },
  'style.maskClip': function (name, element, value) { element.attributes.style.maskClip = value },
  'style.maskComposite': function (name, element, value) { element.attributes.style.maskComposite = value },
  'style.maskImage': function (name, element, value) { element.attributes.style.maskImage = value },
  'style.maskMode': function (name, element, value) { element.attributes.style.maskMode = value },
  'style.maskOrigin': function (name, element, value) { element.attributes.style.maskOrigin = value },
  'style.maskPosition': function (name, element, value) { element.attributes.style.maskPosition = value },
  'style.maskRepeat': function (name, element, value) { element.attributes.style.maskRepeat = value },
  'style.maskSize': function (name, element, value) { element.attributes.style.maskSize = value },
  'style.maskType': function (name, element, value) { element.attributes.style.maskType = value },
  'style.maxHeight': function (name, element, value) { element.attributes.style.maxHeight = value },
  'style.maxLines': function (name, element, value) { element.attributes.style.maxLines = value },
  'style.maxWidth': function (name, element, value) { element.attributes.style.maxWidth = value },
  'style.minHeight': function (name, element, value) { element.attributes.style.minHeight = value },
  'style.minWidth': function (name, element, value) { element.attributes.style.minWidth = value },
  'style.mixBlendMode': function (name, element, value) { element.attributes.style.mixBlendMode = value },
  'style.motion': function (name, element, value) { element.attributes.style.motion = value },
  'style.motionOffset': function (name, element, value) { element.attributes.style.motionOffset = value },
  'style.motionPath': function (name, element, value) { element.attributes.style.motionPath = value },
  'style.motionRotation': function (name, element, value) { element.attributes.style.motionRotation = value },
  'style.navDown': function (name, element, value) { element.attributes.style.navDown = value },
  'style.navLeft': function (name, element, value) { element.attributes.style.navLeft = value },
  'style.navRight': function (name, element, value) { element.attributes.style.navRight = value },
  'style.navUp': function (name, element, value) { element.attributes.style.navUp = value },
  'style.objectFit': function (name, element, value) { element.attributes.style.objectFit = value },
  'style.objectPosition': function (name, element, value) { element.attributes.style.objectPosition = value },
  'style.offset': function (name, element, value) { element.attributes.style.offset = value },
  'style.offsetAfter': function (name, element, value) { element.attributes.style.offsetAfter = value },
  'style.offsetAnchor': function (name, element, value) { element.attributes.style.offsetAnchor = value },
  'style.offsetBefore': function (name, element, value) { element.attributes.style.offsetBefore = value },
  'style.offsetDistance': function (name, element, value) { element.attributes.style.offsetDistance = value },
  'style.offsetEnd': function (name, element, value) { element.attributes.style.offsetEnd = value },
  'style.offsetPath': function (name, element, value) { element.attributes.style.offsetPath = value },
  'style.offsetPosition': function (name, element, value) { element.attributes.style.offsetPosition = value },
  'style.offsetRotate': function (name, element, value) { element.attributes.style.offsetRotate = value },
  'style.offsetStart': function (name, element, value) { element.attributes.style.offsetStart = value },
  'style.opacity': function (name, element, value) { element.attributes.style.opacity = value },
  'style.order': function (name, element, value) { element.attributes.style.order = value },
  'style.orphans': function (name, element, value) { element.attributes.style.orphans = value },
  'style.outline': function (name, element, value) { element.attributes.style.outline = value },
  'style.outlineColor': function (name, element, value) { element.attributes.style.outlineColor = value },
  'style.outlineOffset': function (name, element, value) { element.attributes.style.outlineOffset = value },
  'style.outlineStyle': function (name, element, value) { element.attributes.style.outlineStyle = value },
  'style.outlineWidth': function (name, element, value) { element.attributes.style.outlineWidth = value },
  'style.overflow': function (name, element, value) { element.attributes.style.overflow = value },
  'style.overflowStyle': function (name, element, value) { element.attributes.style.overflowStyle = value },
  'style.overflowWrap': function (name, element, value) { element.attributes.style.overflowWrap = value },
  'style.overflowX': function (name, element, value) { element.attributes.style.overflowX = value },
  'style.overflowY': function (name, element, value) { element.attributes.style.overflowY = value },
  'style.padding': function (name, element, value) { element.attributes.style.padding = value },
  'style.paddingBottom': function (name, element, value) { element.attributes.style.paddingBottom = value },
  'style.paddingLeft': function (name, element, value) { element.attributes.style.paddingLeft = value },
  'style.paddingRight': function (name, element, value) { element.attributes.style.paddingRight = value },
  'style.paddingTop': function (name, element, value) { element.attributes.style.paddingTop = value },
  'style.page': function (name, element, value) { element.attributes.style.page = value },
  'style.pageBreakAfter': function (name, element, value) { element.attributes.style.pageBreakAfter = value },
  'style.pageBreakBefore': function (name, element, value) { element.attributes.style.pageBreakBefore = value },
  'style.pageBreakInside': function (name, element, value) { element.attributes.style.pageBreakInside = value },
  'style.pause': function (name, element, value) { element.attributes.style.pause = value },
  'style.pauseAfter': function (name, element, value) { element.attributes.style.pauseAfter = value },
  'style.pauseBefore': function (name, element, value) { element.attributes.style.pauseBefore = value },
  'style.perspective': function (name, element, value) { element.attributes.style.perspective = value },
  'style.perspectiveOrigin': function (name, element, value) { element.attributes.style.perspectiveOrigin = value },
  'style.pitch': function (name, element, value) { element.attributes.style.pitch = value },
  'style.pitchRange': function (name, element, value) { element.attributes.style.pitchRange = value },
  'style.placeContent': function (name, element, value) { element.attributes.style.placeContent = value },
  'style.placeItems': function (name, element, value) { element.attributes.style.placeItems = value },
  'style.placeSelf': function (name, element, value) { element.attributes.style.placeSelf = value },
  'style.playDuring': function (name, element, value) { element.attributes.style.playDuring = value },
  'style.pointerEvents': function (name, element, value) { element.attributes.style.pointerEvents = value },
  'style.polarAnchor': function (name, element, value) { element.attributes.style.polarAnchor = value },
  'style.polarAngle': function (name, element, value) { element.attributes.style.polarAngle = value },
  'style.polarDistance': function (name, element, value) { element.attributes.style.polarDistance = value },
  'style.polarOrigin': function (name, element, value) { element.attributes.style.polarOrigin = value },
  'style.position': function (name, element, value) { element.attributes.style.position = value },
  'style.presentationLevel': function (name, element, value) { element.attributes.style.presentationLevel = value },
  'style.quotes': function (name, element, value) { element.attributes.style.quotes = value },
  'style.regionFragment': function (name, element, value) { element.attributes.style.regionFragment = value },
  'style.resize': function (name, element, value) { element.attributes.style.resize = value },
  'style.rest': function (name, element, value) { element.attributes.style.rest = value },
  'style.restAfter': function (name, element, value) { element.attributes.style.restAfter = value },
  'style.restBefore': function (name, element, value) { element.attributes.style.restBefore = value },
  'style.richness': function (name, element, value) { element.attributes.style.richness = value },
  'style.right': function (name, element, value) { element.attributes.style.right = value },
  'style.rotation': function (name, element, value) { element.attributes.style.rotation = value },
  'style.rotationPoint': function (name, element, value) { element.attributes.style.rotationPoint = value },
  'style.rubyAlign': function (name, element, value) { element.attributes.style.rubyAlign = value },
  'style.rubyMerge': function (name, element, value) { element.attributes.style.rubyMerge = value },
  'style.rubyPosition': function (name, element, value) { element.attributes.style.rubyPosition = value },
  'style.running': function (name, element, value) { element.attributes.style.running = value },
  'style.scrollBehavior': function (name, element, value) { element.attributes.style.scrollBehavior = value },
  'style.scrollPadding': function (name, element, value) { element.attributes.style.scrollPadding = value },
  'style.scrollPaddingBlock': function (name, element, value) { element.attributes.style.scrollPaddingBlock = value },
  'style.scrollPaddingBlockEnd': function (name, element, value) { element.attributes.style.scrollPaddingBlockEnd = value },
  'style.scrollPaddingBlockStart': function (name, element, value) { element.attributes.style.scrollPaddingBlockStart = value },
  'style.scrollPaddingBottom': function (name, element, value) { element.attributes.style.scrollPaddingBottom = value },
  'style.scrollPaddingInline': function (name, element, value) { element.attributes.style.scrollPaddingInline = value },
  'style.scrollPaddingInlineEnd': function (name, element, value) { element.attributes.style.scrollPaddingInlineEnd = value },
  'style.scrollPaddingInlineStart': function (name, element, value) { element.attributes.style.scrollPaddingInlineStart = value },
  'style.scrollPaddingLeft': function (name, element, value) { element.attributes.style.scrollPaddingLeft = value },
  'style.scrollPaddingRight': function (name, element, value) { element.attributes.style.scrollPaddingRight = value },
  'style.scrollPaddingTop': function (name, element, value) { element.attributes.style.scrollPaddingTop = value },
  'style.scrollSnapAlign': function (name, element, value) { element.attributes.style.scrollSnapAlign = value },
  'style.scrollSnapMargin': function (name, element, value) { element.attributes.style.scrollSnapMargin = value },
  'style.scrollSnapMarginBlock': function (name, element, value) { element.attributes.style.scrollSnapMarginBlock = value },
  'style.scrollSnapMarginBlockEnd': function (name, element, value) { element.attributes.style.scrollSnapMarginBlockEnd = value },
  'style.scrollSnapMarginBlockStart': function (name, element, value) { element.attributes.style.scrollSnapMarginBlockStart = value },
  'style.scrollSnapMarginBottom': function (name, element, value) { element.attributes.style.scrollSnapMarginBottom = value },
  'style.scrollSnapMarginInline': function (name, element, value) { element.attributes.style.scrollSnapMarginInline = value },
  'style.scrollSnapMarginInlineEnd': function (name, element, value) { element.attributes.style.scrollSnapMarginInlineEnd = value },
  'style.scrollSnapMarginInlineStart': function (name, element, value) { element.attributes.style.scrollSnapMarginInlineStart = value },
  'style.scrollSnapMarginLeft': function (name, element, value) { element.attributes.style.scrollSnapMarginLeft = value },
  'style.scrollSnapMarginRight': function (name, element, value) { element.attributes.style.scrollSnapMarginRight = value },
  'style.scrollSnapMarginTop': function (name, element, value) { element.attributes.style.scrollSnapMarginTop = value },
  'style.scrollSnapStop': function (name, element, value) { element.attributes.style.scrollSnapStop = value },
  'style.scrollSnapType': function (name, element, value) { element.attributes.style.scrollSnapType = value },
  'style.shapeImageThreshold': function (name, element, value) { element.attributes.style.shapeImageThreshold = value },
  'style.shapeInside': function (name, element, value) { element.attributes.style.shapeInside = value },
  'style.shapeMargin': function (name, element, value) { element.attributes.style.shapeMargin = value },
  'style.shapeOutside': function (name, element, value) { element.attributes.style.shapeOutside = value },
  'style.shapeRendering': function (name, element, value) { element.attributes.style.shapeRendering = value },
  'style.size': function (name, element, value) { element.attributes.style.size = value },
  'style.speak': function (name, element, value) { element.attributes.style.speak = value },
  'style.speakAs': function (name, element, value) { element.attributes.style.speakAs = value },
  'style.speakHeader': function (name, element, value) { element.attributes.style.speakHeader = value },
  'style.speakNumeral': function (name, element, value) { element.attributes.style.speakNumeral = value },
  'style.speakPunctuation': function (name, element, value) { element.attributes.style.speakPunctuation = value },
  'style.speechRate': function (name, element, value) { element.attributes.style.speechRate = value },
  'style.stopColor': function (name, element, value) { element.attributes.style.stopColor = value },
  'style.stopOpacity': function (name, element, value) { element.attributes.style.stopOpacity = value },
  'style.stress': function (name, element, value) { element.attributes.style.stress = value },
  'style.stringSet': function (name, element, value) { element.attributes.style.stringSet = value },
  'style.stroke': function (name, element, value) { element.attributes.style.stroke = value },
  'style.strokeAlignment': function (name, element, value) { element.attributes.style.strokeAlignment = value },
  'style.strokeDashadjust': function (name, element, value) { element.attributes.style.strokeDashadjust = value },
  'style.strokeDasharray': function (name, element, value) { element.attributes.style.strokeDasharray = value },
  'style.strokeDashcorner': function (name, element, value) { element.attributes.style.strokeDashcorner = value },
  'style.strokeDashoffset': function (name, element, value) { element.attributes.style.strokeDashoffset = value },
  'style.strokeLinecap': function (name, element, value) { element.attributes.style.strokeLinecap = value },
  'style.strokeLinejoin': function (name, element, value) { element.attributes.style.strokeLinejoin = value },
  'style.strokeMiterlimit': function (name, element, value) { element.attributes.style.strokeMiterlimit = value },
  'style.strokeOpacity': function (name, element, value) { element.attributes.style.strokeOpacity = value },
  'style.strokeWidth': function (name, element, value) { element.attributes.style.strokeWidth = value },
  'style.tableLayout': function (name, element, value) { element.attributes.style.tableLayout = value },
  'style.tabSize': function (name, element, value) { element.attributes.style.tabSize = value },
  'style.textAlign': function (name, element, value) { element.attributes.style.textAlign = value },
  'style.textAlignAll': function (name, element, value) { element.attributes.style.textAlignAll = value },
  'style.textAlignLast': function (name, element, value) { element.attributes.style.textAlignLast = value },
  'style.textAnchor': function (name, element, value) { element.attributes.style.textAnchor = value },
  'style.textCombineUpright': function (name, element, value) { element.attributes.style.textCombineUpright = value },
  'style.textDecoration': function (name, element, value) { element.attributes.style.textDecoration = value },
  'style.textDecorationColor': function (name, element, value) { element.attributes.style.textDecorationColor = value },
  'style.textDecorationLine': function (name, element, value) { element.attributes.style.textDecorationLine = value },
  'style.textDecorationSkip': function (name, element, value) { element.attributes.style.textDecorationSkip = value },
  'style.textDecorationStyle': function (name, element, value) { element.attributes.style.textDecorationStyle = value },
  'style.textEmphasis': function (name, element, value) { element.attributes.style.textEmphasis = value },
  'style.textEmphasisColor': function (name, element, value) { element.attributes.style.textEmphasisColor = value },
  'style.textEmphasisPosition': function (name, element, value) { element.attributes.style.textEmphasisPosition = value },
  'style.textEmphasisStyle': function (name, element, value) { element.attributes.style.textEmphasisStyle = value },
  'style.textIndent': function (name, element, value) { element.attributes.style.textIndent = value },
  'style.textJustify': function (name, element, value) { element.attributes.style.textJustify = value },
  'style.textOrientation': function (name, element, value) { element.attributes.style.textOrientation = value },
  'style.textOverflow': function (name, element, value) { element.attributes.style.textOverflow = value },
  'style.textRendering': function (name, element, value) { element.attributes.style.textRendering = value },
  'style.textShadow': function (name, element, value) { element.attributes.style.textShadow = value },
  'style.textSpaceCollapse': function (name, element, value) { element.attributes.style.textSpaceCollapse = value },
  'style.textSpaceTrim': function (name, element, value) { element.attributes.style.textSpaceTrim = value },
  'style.textSpacing': function (name, element, value) { element.attributes.style.textSpacing = value },
  'style.textTransform': function (name, element, value) { element.attributes.style.textTransform = value },
  'style.textUnderlinePosition': function (name, element, value) { element.attributes.style.textUnderlinePosition = value },
  'style.textWrap': function (name, element, value) { element.attributes.style.textWrap = value },
  'style.top': function (name, element, value) { element.attributes.style.top = value },
  'style.transform': function (name, element, value) { element.attributes.style.transform = value },
  'style.transformBox': function (name, element, value) { element.attributes.style.transformBox = value },
  'style.transformOrigin': function (name, element, value) { element.attributes.style.transformOrigin = value },
  'style.transformStyle': function (name, element, value) { element.attributes.style.transformStyle = value },
  'style.transition': function (name, element, value) { element.attributes.style.transition = value },
  'style.transitionDelay': function (name, element, value) { element.attributes.style.transitionDelay = value },
  'style.transitionDuration': function (name, element, value) { element.attributes.style.transitionDuration = value },
  'style.transitionProperty': function (name, element, value) { element.attributes.style.transitionProperty = value },
  'style.transitionTimingFunction': function (name, element, value) { element.attributes.style.transitionTimingFunction = value },
  'style.unicodeBidi': function (name, element, value) { element.attributes.style.unicodeBidi = value },
  'style.userSelect': function (name, element, value) { element.attributes.style.userSelect = value },
  'style.verticalAlign': function (name, element, value) { element.attributes.style.verticalAlign = value },
  'style.visibility': function (name, element, value) { element.attributes.style.visibility = value },
  'style.voiceBalance': function (name, element, value) { element.attributes.style.voiceBalance = value },
  'style.voiceDuration': function (name, element, value) { element.attributes.style.voiceDuration = value },
  'style.voiceFamily': function (name, element, value) { element.attributes.style.voiceFamily = value },
  'style.voicePitch': function (name, element, value) { element.attributes.style.voicePitch = value },
  'style.voiceRange': function (name, element, value) { element.attributes.style.voiceRange = value },
  'style.voiceRate': function (name, element, value) { element.attributes.style.voiceRate = value },
  'style.voiceStress': function (name, element, value) { element.attributes.style.voiceStress = value },
  'style.voiceVolume': function (name, element, value) { element.attributes.style.voiceVolume = value },
  'style.volume': function (name, element, value) { element.attributes.style.volume = value },
  'style.whiteSpace': function (name, element, value) { element.attributes.style.whiteSpace = value },
  'style.widows': function (name, element, value) { element.attributes.style.widows = value },
  'style.width': function (name, element, value) { element.attributes.style.width = value },
  'style.willChange': function (name, element, value) { element.attributes.style.willChange = value },
  'style.wordBreak': function (name, element, value) { element.attributes.style.wordBreak = value },
  'style.wordSpacing': function (name, element, value) { element.attributes.style.wordSpacing = value },
  'style.wordWrap': function (name, element, value) { element.attributes.style.wordWrap = value },
  'style.wrapAfter': function (name, element, value) { element.attributes.style.wrapAfter = value },
  'style.wrapBefore': function (name, element, value) { element.attributes.style.wrapBefore = value },
  'style.wrapFlow': function (name, element, value) { element.attributes.style.wrapFlow = value },
  'style.wrapInside': function (name, element, value) { element.attributes.style.wrapInside = value },
  'style.wrapThrough': function (name, element, value) { element.attributes.style.wrapThrough = value },
  'style.writingMode': function (name, element, value) { element.attributes.style.writingMode = value },
  'style.zIndex': function (name, element, value) { element.attributes.style.zIndex = value },
  'style.WebkitTapHighlightColor': function (name, element, value) { element.attributes.style.webkitTapHighlightColor = value }
}

var TEXT_CONTENT_VANITIES = {
  content: function (name, element, value) {
    element.children = [value + '']
  }
}

var PRESENTATION_VANITIES = {
  alignmentBaseline: function (name, element, value) { element.attributes['alignmentBaseline'] = value },
  baselineShift: function (name, element, value) { element.attributes['baselineShift'] = value },
  clipPath: function (name, element, value) { element.attributes['clipPath'] = value },
  clipRule: function (name, element, value) { element.attributes['clipRule'] = value },
  clip: function (name, element, value) { element.attributes['clip'] = value },
  colorInterpolationFilters: function (name, element, value) { element.attributes['colorInterpolationFilters'] = value },
  colorInterpolation: function (name, element, value) { element.attributes['colorInterpolation'] = value },
  colorProfile: function (name, element, value) { element.attributes['colorProfile'] = value },
  colorRendering: function (name, element, value) { element.attributes['colorRendering'] = value },
  color: function (name, element, value) { element.attributes['color'] = value },
  cursor: function (name, element, value) { element.attributes['cursor'] = value },
  direction: function (name, element, value) { element.attributes['direction'] = value },
  display: function (name, element, value) { element.attributes['display'] = value },
  dominantBaseline: function (name, element, value) { element.attributes['dominantBaseline'] = value },
  enableBackground: function (name, element, value) { element.attributes['enableBackground'] = value },
  fillOpacity: function (name, element, value) { element.attributes['fillOpacity'] = value },
  fillRule: function (name, element, value) { element.attributes['fillRule'] = value },
  fill: function (name, element, value) { element.attributes['fill'] = value },
  filter: function (name, element, value) { element.attributes['filter'] = value },
  floodColor: function (name, element, value) { element.attributes['floodColor'] = value },
  floodOpacity: function (name, element, value) { element.attributes['floodOpacity'] = value },
  fontFamily: function (name, element, value) { element.attributes['fontFamily'] = value },
  fontSizeAdjust: function (name, element, value) { element.attributes['fontSizeAdjust'] = value },
  fontSize: function (name, element, value) { element.attributes['fontSize'] = value },
  fontStretch: function (name, element, value) { element.attributes['fontStretch'] = value },
  fontStyle: function (name, element, value) { element.attributes['fontStyle'] = value },
  fontVariant: function (name, element, value) { element.attributes['fontVariant'] = value },
  fontWeight: function (name, element, value) { element.attributes['fontWeight'] = value },
  glyphOrientationHorizontal: function (name, element, value) { element.attributes['glyphOrientationHorizontal'] = value },
  glyphOrientationVertical: function (name, element, value) { element.attributes['glyphOrientationVertical'] = value },
  imageRendering: function (name, element, value) { element.attributes['imageRendering'] = value },
  kerning: function (name, element, value) { element.attributes['kerning'] = value },
  letterSpacing: function (name, element, value) { element.attributes['letterSpacing'] = value },
  lightingColor: function (name, element, value) { element.attributes['lightingColor'] = value },
  markerEnd: function (name, element, value) { element.attributes['markerEnd'] = value },
  markerMid: function (name, element, value) { element.attributes['markerMid'] = value },
  markerStart: function (name, element, value) { element.attributes['markerStart'] = value },
  mask: function (name, element, value) { element.attributes['mask'] = value },
  opacity: function (name, element, value) { element.attributes['opacity'] = value },
  overflow: function (name, element, value) { element.attributes['overflow'] = value },
  pointerEvents: function (name, element, value) { element.attributes['pointerEvents'] = value },
  shapeRendering: function (name, element, value) { element.attributes['shapeRendering'] = value },
  stopColor: function (name, element, value) { element.attributes['stopColor'] = value },
  stopOpacity: function (name, element, value) { element.attributes['stopOpacity'] = value },
  strokeDasharray: function (name, element, value) { element.attributes['strokeDasharray'] = value },
  strokeDashoffset: function (name, element, value) { element.attributes['strokeDashoffset'] = value },
  strokeLinecap: function (name, element, value) { element.attributes['strokeLinecap'] = value },
  strokeLinejoin: function (name, element, value) { element.attributes['strokeLinejoin'] = value },
  strokeMiterlimit: function (name, element, value) { element.attributes['strokeMiterlimit'] = value },
  strokeOpacity: function (name, element, value) { element.attributes['strokeOpacity'] = value },
  strokeWidth: function (name, element, value) { element.attributes['strokeWidth'] = value },
  stroke: function (name, element, value) { element.attributes['stroke'] = value },
  textAnchor: function (name, element, value) { element.attributes['textAnchor'] = value },
  textDecoration: function (name, element, value) { element.attributes['textDecoration'] = value },
  textRendering: function (name, element, value) { element.attributes['textRendering'] = value },
  unicodeBidi: function (name, element, value) { element.attributes['unicodeBidi'] = value },
  visibility: function (name, element, value) { element.attributes['visibility'] = value },
  wordSpacing: function (name, element, value) { element.attributes['wordSpacing'] = value },
  writingMode: function (name, element, value) { element.attributes['writingMode'] = value }
}

var HTML_STYLE_SHORTHAND_VANITIES = {
  backgroundColor: function (name, element, value) {
    element.attributes.style.backgroundColor = value
  },
  zIndex: function (name, element, value) {
    element.attributes.style.zIndex = value
  }
}

var CONTROL_FLOW_VANITIES = {
  // 'controlFlow.if': function (name, element, value) {
  //   // TODO
  // },
  // 'controlFlow.repeat': function (name, element, value) {
  //   // TODO
  // },
  // 'controlFlow.yield': function (name, element, value) {
  //   // TODO
  // },
  'controlFlow.insert': function (name, element, value, context, component) {
    if (value === null || value === undefined) return void (0)
    if (typeof value !== 'number') throw new Error('controlFlow.insert expects null or number')
    if (!context.options.children) return void (0)
    var children = (Array.isArray(context.options.children)) ? context.options.children : [context.options.children]
    var surrogate = children[value]
    if (surrogate === null || surrogate === undefined) return void (0)
    // If we are running via a framework adapter, allow that framework to provide its own insert mechanism.
    // This is necessary e.g. in React where their element format needs to be converted into our 'mana' format
    if (context.options.vanities['controlFlow.insert']) {
      context.options.vanities['controlFlow.insert'](element, surrogate, context, component, controlFlowInsertImpl)
    } else {
      controlFlowInsertImpl(element, surrogate, context, component)
    }
  },
  'controlFlow.placeholder': function (name, element, value, context, component) {
    if (value === null || value === undefined) return void (0)
    if (typeof value !== 'number') throw new Error('controlFlow.placeholder expects null or number')
    if (!context.options.children) return void (0)
    var children = (Array.isArray(context.options.children)) ? context.options.children : [context.options.children]
    var surrogate = children[value]
    if (surrogate === null || surrogate === undefined) return void (0)
    // If we are running via a framework adapter, allow that framework to provide its own placeholder mechanism.
    // This is necessary e.g. in React where their element format needs to be converted into our 'mana' format
    if (context.options.vanities['controlFlow.placeholder']) {
      context.options.vanities['controlFlow.placeholder'](element, surrogate, context, component, controlFlowPlaceholderImpl)
    } else {
      controlFlowPlaceholderImpl(element, surrogate, context, component)
    }
  }
}

function controlFlowPlaceholderImpl (element, surrogate, context, component) {
  element.elementName = surrogate.elementName
  element.children = surrogate.children || []
  if (surrogate.attributes) {
    if (!element.attributes) element.attributes = {}
    for (var key in surrogate.attributes) {
      if (key === 'haiku-id') continue
      element.attributes[key] = surrogate.attributes[key]
    }
  }
}

function controlFlowInsertImpl (element, surrogate, context, component) {
  element.children = [surrogate]
}

module.exports = {
  'missing-glyph': has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  a: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES, STYLE_VANITIES),
  abbr: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  acronym: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  address: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  altGlyph: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  altGlyphDef: has(),
  altGlyphItem: has(),
  animate: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  animateColor: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  animateMotion: has(),
  animateTransform: has(),
  applet: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  area: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  article: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  aside: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  audio: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  b: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  base: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  basefont: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  bdi: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  bdo: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  big: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  blockquote: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  body: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  br: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  button: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  canvas: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  caption: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  center: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  circle: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  cite: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  clipPath: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  code: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  col: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  colgroup: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  'color-profile': has(),
  command: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  cursor: has(),
  datalist: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dd: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  defs: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  del: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  desc: has(),
  details: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dfn: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dir: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  discard: has(),
  div: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dl: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dt: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ellipse: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  em: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  embed: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  feBlend: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feColorMatrix: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feComponentTransfer: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feComposite: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feConvolveMatrix: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feDiffuseLighting: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feDisplacementMap: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feDistantLight: has(),
  feDropShadow: has(),
  feFlood: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feFuncA: has(),
  feFuncB: has(),
  feFuncG: has(),
  feFuncR: has(),
  feGaussianBlur: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feImage: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feMerge: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feMergeNode: has(),
  feMorphology: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feOffset: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  fePointLight: has(),
  feSpecularLighting: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feTile: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feTurbulence: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  fieldset: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  figcaption: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  figure: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  filter: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  'font-face': has(),
  'font-face-format': has(),
  'font-face-name': has(),
  'font-face-src': has(),
  'font-face-uri': has(),
  font: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES, STYLE_VANITIES),
  footer: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  foreignObject: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  form: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  frame: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  frameset: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  g: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  glyph: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  glyphRef: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  h1: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  h2: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  h3: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  h4: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  h5: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  h6: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  hatch: has(),
  hatchpath: has(),
  head: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  header: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  hgroup: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  hkern: has(),
  hr: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  html: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  i: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  iframe: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  image: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  img: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  input: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ins: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  kbd: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  keygen: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  label: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  legend: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  li: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  line: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  linearGradient: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  link: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  map: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  mark: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  marker: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  mask: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  menu: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  mesh: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  meshgradient: has(),
  meshpatch: has(),
  meshrow: has(),
  meta: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  metadata: has(),
  meter: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  mpath: has(),
  nav: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  noframes: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  noscript: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  object: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ol: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  optgroup: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  option: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  output: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  p: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  param: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  path: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  pattern: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  polygon: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  polyline: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  pre: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  progress: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  q: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  radialGradient: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  rect: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  rp: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  rt: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ruby: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  s: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  samp: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  script: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  section: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  select: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  set: has(),
  small: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  solidcolor: has(),
  source: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  span: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  stop: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  strike: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  strong: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  style: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  sub: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  summary: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  sup: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  svg: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES, STYLE_VANITIES, HTML_STYLE_SHORTHAND_VANITIES),
  switch: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  symbol: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  table: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  tbody: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  td: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  text: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  textarea: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  textPath: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  tfoot: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  th: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  thead: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  time: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  title: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  tr: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  track: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  tref: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  tspan: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  tt: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  u: has(HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ul: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  unknown: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  us: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  use: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  var: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  video: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  view: has(),
  vker: has(),
  wb: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES)
}
