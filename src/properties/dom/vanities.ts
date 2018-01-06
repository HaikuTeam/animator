/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import Layout3D from './../../Layout3D';
import has from './has';

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

const LAYOUT_3D_VANITIES = {
  // Layout has a couple of special values that relate to display
  // but not to position:
  shown: (_, element, value) => {
    element.layout.shown = value;
  },
  opacity: (_, element, value) => {
    element.layout.opacity = value;
  },

  // Rotation is a special snowflake since it needs to account for
  // the w-component of the quaternion and carry it
  'rotation.x': (name, element, value) => {
    element.layout.rotation.x = value;
    element.layout.orientation = Layout3D.computeOrientationFlexibly(
      element.layout.rotation.x,
      element.layout.rotation.y,
      element.layout.rotation.z,
      element.layout.rotation.w,
      element.layout.rotation,
    );
  },
  'rotation.y': (name, element, value) => {
    element.layout.rotation.y = value;
    element.layout.orientation = Layout3D.computeOrientationFlexibly(
      element.layout.rotation.x,
      element.layout.rotation.y,
      element.layout.rotation.z,
      element.layout.rotation.w,
      element.layout.orientation,
    );
  },
  'rotation.z': (name, element, value) => {
    element.layout.rotation.z = value;
    element.layout.orientation = Layout3D.computeOrientationFlexibly(
      element.layout.rotation.x,
      element.layout.rotation.y,
      element.layout.rotation.z,
      element.layout.rotation.w,
      element.layout.orientation,
    );
  },
  'rotation.w': (name, element, value) => {
    element.layout.rotation.w = value;
    element.layout.orientation = Layout3D.computeOrientationFlexibly(
      element.layout.rotation.x,
      element.layout.rotation.y,
      element.layout.rotation.z,
      element.layout.rotation.w,
      element.layout.orientation,
    );
  },

  // If you really want to set what we call 'position' then
  // we do so on the element's attributes; this is mainly to
  // enable the x/y positioning system for SVG elements.
  'position.x': (name, element, value) => {
    element.attributes.x = value;
  },
  'position.y': (name, element, value) => {
    element.attributes.y = value;
  },

  // Everything that follows is a standard 3-coord component
  // relating to the element's position in space

  'align.x': (name, element, value) => {
    element.layout.align.x = value;
  },
  'align.y': (name, element, value) => {
    element.layout.align.y = value;
  },
  'align.z': (name, element, value) => {
    element.layout.align.z = value;
  },
  'mount.x': (name, element, value) => {
    element.layout.mount.x = value;
  },
  'mount.y': (name, element, value) => {
    element.layout.mount.y = value;
  },
  'mount.z': (name, element, value) => {
    element.layout.mount.z = value;
  },
  'origin.x': (name, element, value) => {
    element.layout.origin.x = value;
  },
  'origin.y': (name, element, value) => {
    element.layout.origin.y = value;
  },
  'origin.z': (name, element, value) => {
    element.layout.origin.z = value;
  },
  'scale.x': (name, element, value) => {
    element.layout.scale.x = value;
  },
  'scale.y': (name, element, value) => {
    element.layout.scale.y = value;
  },
  'scale.z': (name, element, value) => {
    element.layout.scale.z = value;
  },
  'sizeAbsolute.x': (name, element, value) => {
    element.layout.sizeAbsolute.x = value;
  },
  'sizeAbsolute.y': (name, element, value) => {
    element.layout.sizeAbsolute.y = value;
  },
  'sizeAbsolute.z': (name, element, value) => {
    element.layout.sizeAbsolute.z = value;
  },
  'sizeDifferential.x': (name, element, value) => {
    element.layout.sizeDifferential.x = value;
  },
  'sizeDifferential.y': (name, element, value) => {
    element.layout.sizeDifferential.y = value;
  },
  'sizeDifferential.z': (name, element, value) => {
    element.layout.sizeDifferential.z = value;
  },
  'sizeMode.x': (name, element, value) => {
    element.layout.sizeMode.x = value;
  },
  'sizeMode.y': (name, element, value) => {
    element.layout.sizeMode.y = value;
  },
  'sizeMode.z': (name, element, value) => {
    element.layout.sizeMode.z = value;
  },
  'sizeProportional.x': (name, element, value) => {
    element.layout.sizeProportional.x = value;
  },
  'sizeProportional.y': (name, element, value) => {
    element.layout.sizeProportional.y = value;
  },
  'sizeProportional.z': (name, element, value) => {
    element.layout.sizeProportional.z = value;
  },
  'translation.x': (name, element, value) => {
    element.layout.translation.x = value;
  },
  'translation.y': (name, element, value) => {
    element.layout.translation.y = value;
  },
  'translation.z': (name, element, value) => {
    element.layout.translation.z = value;
  },
};

const LAYOUT_2D_VANITIES = {...LAYOUT_3D_VANITIES};

function styleSetter(prop) {
  return function (name, element, value) {
    element.attributes.style[prop] = value;
  };
}

const STYLE_VANITIES = {
  backgroundColor: styleSetter('backgroundColor'),
  'style.alignContent': styleSetter('alignContent'),
  'style.alignItems': styleSetter('alignItems'),
  'style.alignmentBaseline': styleSetter('alignmentBaseline'),
  'style.alignSelf': styleSetter('alignSelf'),
  'style.all': styleSetter('all'),
  'style.animation': styleSetter('animation'),
  'style.animationDelay': styleSetter('animationDelay'),
  'style.animationDirection': styleSetter('animationDirection'),
  'style.animationDuration': styleSetter('animationDuration'),
  'style.animationFillMode': styleSetter('animationFillMode'),
  'style.animationIterationCount': styleSetter('animationIterationCount'),
  'style.animationName': styleSetter('animationName'),
  'style.animationPlayState': styleSetter('animationPlayState'),
  'style.animationTimingFunction': styleSetter('animationTimingFunction'),
  'style.appearance': styleSetter('appearance'),
  'style.azimuth': styleSetter('azimuth'),
  'style.backfaceVisibility': styleSetter('backfaceVisibility'),
  'style.background': styleSetter('background'),
  'style.backgroundAttachment': styleSetter('backgroundAttachment'),
  'style.backgroundBlendMode': styleSetter('backgroundBlendMode'),
  'style.backgroundClip': styleSetter('backgroundClip'),
  'style.backgroundColor': styleSetter('backgroundColor'),
  'style.backgroundimage': styleSetter('backgroundimage'),
  'style.backgroundorigin': styleSetter('backgroundorigin'),
  'style.backgroundposition': styleSetter('backgroundposition'),
  'style.backgroundRepeat': styleSetter('backgroundRepeat'),
  'style.backgroundSize': styleSetter('backgroundSize'),
  'style.baselineShift': styleSetter('baselineShift'),
  'style.bookmarkLabel': styleSetter('bookmarkLabel'),
  'style.bookmarkLevel': styleSetter('bookmarkLevel'),
  'style.bookmarkState': styleSetter('bookmarkState'),
  'style.border': styleSetter('border'),
  'style.borderBottom': styleSetter('borderBottom'),
  'style.borderBottomColor': styleSetter('borderBottomColor'),
  'style.borderBottomLeftRadius': styleSetter('borderBottomLeftRadius'),
  'style.borderBottomRightRadius': styleSetter('borderBottomRightRadius'),
  'style.borderBottomStyle': styleSetter('borderBottomStyle'),
  'style.borderBottomWidth': styleSetter('borderBottomWidth'),
  'style.borderBoundary': styleSetter('borderBoundary'),
  'style.borderCollapse': styleSetter('borderCollapse'),
  'style.borderColor': styleSetter('borderColor'),
  'style.borderImage': styleSetter('borderImage'),
  'style.borderImageOutset': styleSetter('borderImageOutset'),
  'style.borderImageRepeat': styleSetter('borderImageRepeat'),
  'style.borderImageSlice': styleSetter('borderImageSlice'),
  'style.borderImageSource': styleSetter('borderImageSource'),
  'style.borderImageWidth': styleSetter('borderImageWidth'),
  'style.borderLeft': styleSetter('borderLeft'),
  'style.borderLeftColor': styleSetter('borderLeftColor'),
  'style.borderLeftStyle': styleSetter('borderLeftStyle'),
  'style.borderLeftWidth': styleSetter('borderLeftWidth'),
  'style.borderRadius': styleSetter('borderRadius'),
  'style.borderRight': styleSetter('borderRight'),
  'style.borderRightColor': styleSetter('borderRightColor'),
  'style.borderRightStyle': styleSetter('borderRightStyle'),
  'style.borderRightWidth': styleSetter('borderRightWidth'),
  'style.borderSpacing': styleSetter('borderSpacing'),
  'style.borderStyle': styleSetter('borderStyle'),
  'style.borderTop': styleSetter('borderTop'),
  'style.borderTopColor': styleSetter('borderTopColor'),
  'style.borderTopLeftRadius': styleSetter('borderTopLeftRadius'),
  'style.borderTopRightRadius': styleSetter('borderTopRightRadius'),
  'style.borderTopStyle': styleSetter('borderTopStyle'),
  'style.borderTopWidth': styleSetter('borderTopWidth'),
  'style.borderWidth': styleSetter('borderWidth'),
  'style.bottom': styleSetter('bottom'),
  'style.boxDecorationBreak': styleSetter('boxDecorationBreak'),
  'style.boxShadow': styleSetter('boxShadow'),
  'style.boxSizing': styleSetter('boxSizing'),
  'style.boxSnap': styleSetter('boxSnap'),
  'style.boxSuppress': styleSetter('boxSuppress'),
  'style.breakAfter': styleSetter('breakAfter'),
  'style.breakBefore': styleSetter('breakBefore'),
  'style.breakInside': styleSetter('breakInside'),
  'style.captionSide': styleSetter('captionSide'),
  'style.caret': styleSetter('caret'),
  'style.caretAnimation': styleSetter('caretAnimation'),
  'style.caretColor': styleSetter('caretColor'),
  'style.caretShape': styleSetter('caretShape'),
  'style.chains': styleSetter('chains'),
  'style.clear': styleSetter('clear'),
  'style.clip': styleSetter('clip'),
  'style.clipPath': styleSetter('clipPath'),
  'style.clipRule': styleSetter('clipRule'),
  'style.color': styleSetter('color'),
  'style.colorAdjust': styleSetter('colorAdjust'),
  'style.colorInterpolation': styleSetter('colorInterpolation'),
  'style.colorInterpolationFilters': styleSetter('colorInterpolationFilters'),
  'style.colorProfile': styleSetter('colorProfile'),
  'style.colorRendering': styleSetter('colorRendering'),
  'style.columnCount': styleSetter('columnCount'),
  'style.columnFill': styleSetter('columnFill'),
  'style.columnGap': styleSetter('columnGap'),
  'style.columnRule': styleSetter('columnRule'),
  'style.columnRuleColor': styleSetter('columnRuleColor'),
  'style.columnRuleStyle': styleSetter('columnRuleStyle'),
  'style.columnRuleWidth': styleSetter('columnRuleWidth'),
  'style.columns': styleSetter('columns'),
  'style.columnSpan': styleSetter('columnSpan'),
  'style.columnWidth': styleSetter('columnWidth'),
  'style.content': styleSetter('content'),
  'style.continue': styleSetter('continue'),
  'style.counterIncrement': styleSetter('counterIncrement'),
  'style.counterReset': styleSetter('counterReset'),
  'style.counterSet': styleSetter('counterSet'),
  'style.cue': styleSetter('cue'),
  'style.cueAfter': styleSetter('cueAfter'),
  'style.cueBefore': styleSetter('cueBefore'),
  'style.cursor': styleSetter('cursor'),
  'style.direction': styleSetter('direction'),
  'style.display': styleSetter('display'),
  'style.dominantBaseline': styleSetter('dominantBaseline'),
  'style.elevation': styleSetter('elevation'),
  'style.emptyCells': styleSetter('emptyCells'),
  'style.enableBackground': styleSetter('enableBackground'),
  'style.fill': styleSetter('fill'),
  'style.fillOpacity': styleSetter('fillOpacity'),
  'style.fillRule': styleSetter('fillRule'),
  'style.filter': styleSetter('filter'),
  'style.flex': styleSetter('flex'),
  'style.flexBasis': styleSetter('flexBasis'),
  'style.flexDirection': styleSetter('flexDirection'),
  'style.flexFlow': styleSetter('flexFlow'),
  'style.flexGrow': styleSetter('flexGrow'),
  'style.flexShrink': styleSetter('flexShrink'),
  'style.flexWrap': styleSetter('flexWrap'),
  'style.float': styleSetter('float'),
  'style.floatDefer': styleSetter('floatDefer'),
  'style.floatOffset': styleSetter('floatOffset'),
  'style.floatReference': styleSetter('floatReference'),
  'style.floodColor': styleSetter('floodColor'),
  'style.floodOpacity': styleSetter('floodOpacity'),
  'style.flow': styleSetter('flow'),
  'style.flowFrom': styleSetter('flowFrom'),
  'style.flowInto': styleSetter('flowInto'),
  'style.font': styleSetter('font'),
  'style.fontFamily': styleSetter('fontFamily'),
  'style.fontFeatureSettings': styleSetter('fontFeatureSettings'),
  'style.fontKerning': styleSetter('fontKerning'),
  'style.fontLanguageOverride': styleSetter('fontLanguageOverride'),
  'style.fontSize': styleSetter('fontSize'),
  'style.fontSizeAdjust': styleSetter('fontSizeAdjust'),
  'style.fontStretch': styleSetter('fontStretch'),
  'style.fontStyle': styleSetter('fontStyle'),
  'style.fontSynthesis': styleSetter('fontSynthesis'),
  'style.fontVariant': styleSetter('fontVariant'),
  'style.fontVariantAlternates': styleSetter('fontVariantAlternates'),
  'style.fontVariantCaps': styleSetter('fontVariantCaps'),
  'style.fontVariantEastAsian': styleSetter('fontVariantEastAsian'),
  'style.fontVariantLigatures': styleSetter('fontVariantLigatures'),
  'style.fontVariantNumeric': styleSetter('fontVariantNumeric'),
  'style.fontVariantPosition': styleSetter('fontVariantPosition'),
  'style.fontWeight': styleSetter('fontWeight'),
  'style.footnoteDisplay': styleSetter('footnoteDisplay'),
  'style.footnotePolicy': styleSetter('footnotePolicy'),
  'style.glyphOrientationHorizontal': styleSetter('glyphOrientationHorizontal'),
  'style.glyphOrientationVertical': styleSetter('glyphOrientationVertical'),
  'style.grid': styleSetter('grid'),
  'style.gridArea': styleSetter('gridArea'),
  'style.gridAutoColumns': styleSetter('gridAutoColumns'),
  'style.gridAutoFlow': styleSetter('gridAutoFlow'),
  'style.gridAutoRows': styleSetter('gridAutoRows'),
  'style.gridColumn': styleSetter('gridColumn'),
  'style.gridColumnEnd': styleSetter('gridColumnEnd'),
  'style.gridColumnGap': styleSetter('gridColumnGap'),
  'style.gridColumnStart': styleSetter('gridColumnStart'),
  'style.gridGap': styleSetter('gridGap'),
  'style.gridRow': styleSetter('gridRow'),
  'style.gridRowEnd': styleSetter('gridRowEnd'),
  'style.gridRowGap': styleSetter('gridRowGap'),
  'style.gridRowStart': styleSetter('gridRowStart'),
  'style.gridTemplate': styleSetter('gridTemplate'),
  'style.gridTemplateAreas': styleSetter('gridTemplateAreas'),
  'style.gridTemplateColumns': styleSetter('gridTemplateColumns'),
  'style.gridTemplateRows': styleSetter('gridTemplateRows'),
  'style.hangingPunctuation': styleSetter('hangingPunctuation'),
  'style.height': styleSetter('height'),
  'style.hyphenateCharacter': styleSetter('hyphenateCharacter'),
  'style.hyphenateLimitChars': styleSetter('hyphenateLimitChars'),
  'style.hyphenateLimitLast': styleSetter('hyphenateLimitLast'),
  'style.hyphenateLimitLines': styleSetter('hyphenateLimitLines'),
  'style.hyphenateLimitZone': styleSetter('hyphenateLimitZone'),
  'style.hyphens': styleSetter('hyphens'),
  'style.imageOrientation': styleSetter('imageOrientation'),
  'style.imageRendering': styleSetter('imageRendering'),
  'style.imageResolution': styleSetter('imageResolution'),
  'style.initialLetter': styleSetter('initialLetter'),
  'style.initialLetterAlign': styleSetter('initialLetterAlign'),
  'style.initialLetterWrap': styleSetter('initialLetterWrap'),
  'style.isolation': styleSetter('isolation'),
  'style.justifyContent': styleSetter('justifyContent'),
  'style.justifyItems': styleSetter('justifyItems'),
  'style.justifySelf': styleSetter('justifySelf'),
  'style.kerning': styleSetter('kerning'),
  'style.left': styleSetter('left'),
  'style.letterSpacing': styleSetter('letterSpacing'),
  'style.lightingColor': styleSetter('lightingColor'),
  'style.lineBreak': styleSetter('lineBreak'),
  'style.lineGrid': styleSetter('lineGrid'),
  'style.lineHeight': styleSetter('lineHeight'),
  'style.lineSnap': styleSetter('lineSnap'),
  'style.listStyle': styleSetter('listStyle'),
  'style.listStyleImage': styleSetter('listStyleImage'),
  'style.listStylePosition': styleSetter('listStylePosition'),
  'style.listStyleType': styleSetter('listStyleType'),
  'style.margin': styleSetter('margin'),
  'style.marginBottom': styleSetter('marginBottom'),
  'style.marginLeft': styleSetter('marginLeft'),
  'style.marginRight': styleSetter('marginRight'),
  'style.marginTop': styleSetter('marginTop'),
  'style.marker': styleSetter('marker'),
  'style.markerEnd': styleSetter('markerEnd'),
  'style.markerKnockoutLeft': styleSetter('markerKnockoutLeft'),
  'style.markerKnockoutRight': styleSetter('markerKnockoutRight'),
  'style.markerMid': styleSetter('markerMid'),
  'style.markerPattern': styleSetter('markerPattern'),
  'style.markerSegment': styleSetter('markerSegment'),
  'style.markerSide': styleSetter('markerSide'),
  'style.markerStart': styleSetter('markerStart'),
  'style.marqueeDirection': styleSetter('marqueeDirection'),
  'style.marqueeLoop': styleSetter('marqueeLoop'),
  'style.marqueeSpeed': styleSetter('marqueeSpeed'),
  'style.marqueeStyle': styleSetter('marqueeStyle'),
  'style.mask': styleSetter('mask'),
  'style.maskBorder': styleSetter('maskBorder'),
  'style.maskBorderMode': styleSetter('maskBorderMode'),
  'style.maskBorderOutset': styleSetter('maskBorderOutset'),
  'style.maskBorderRepeat': styleSetter('maskBorderRepeat'),
  'style.maskBorderSlice': styleSetter('maskBorderSlice'),
  'style.maskBorderSource': styleSetter('maskBorderSource'),
  'style.maskBorderWidth': styleSetter('maskBorderWidth'),
  'style.maskClip': styleSetter('maskClip'),
  'style.maskComposite': styleSetter('maskComposite'),
  'style.maskImage': styleSetter('maskImage'),
  'style.maskMode': styleSetter('maskMode'),
  'style.maskOrigin': styleSetter('maskOrigin'),
  'style.maskPosition': styleSetter('maskPosition'),
  'style.maskRepeat': styleSetter('maskRepeat'),
  'style.maskSize': styleSetter('maskSize'),
  'style.maskType': styleSetter('maskType'),
  'style.maxHeight': styleSetter('maxHeight'),
  'style.maxLines': styleSetter('maxLines'),
  'style.maxWidth': styleSetter('maxWidth'),
  'style.minHeight': styleSetter('minHeight'),
  'style.minWidth': styleSetter('minWidth'),
  'style.mixBlendMode': styleSetter('mixBlendMode'),
  'style.motion': styleSetter('motion'),
  'style.motionOffset': styleSetter('motionOffset'),
  'style.motionPath': styleSetter('motionPath'),
  'style.motionRotation': styleSetter('motionRotation'),
  'style.navDown': styleSetter('navDown'),
  'style.navLeft': styleSetter('navLeft'),
  'style.navRight': styleSetter('navRight'),
  'style.navUp': styleSetter('navUp'),
  'style.objectFit': styleSetter('objectFit'),
  'style.objectPosition': styleSetter('objectPosition'),
  'style.offset': styleSetter('offset'),
  'style.offsetAfter': styleSetter('offsetAfter'),
  'style.offsetAnchor': styleSetter('offsetAnchor'),
  'style.offsetBefore': styleSetter('offsetBefore'),
  'style.offsetDistance': styleSetter('offsetDistance'),
  'style.offsetEnd': styleSetter('offsetEnd'),
  'style.offsetPath': styleSetter('offsetPath'),
  'style.offsetPosition': styleSetter('offsetPosition'),
  'style.offsetRotate': styleSetter('offsetRotate'),
  'style.offsetStart': styleSetter('offsetStart'),
  'style.opacity': styleSetter('opacity'),
  'style.order': styleSetter('order'),
  'style.orphans': styleSetter('orphans'),
  'style.outline': styleSetter('outline'),
  'style.outlineColor': styleSetter('outlineColor'),
  'style.outlineOffset': styleSetter('outlineOffset'),
  'style.outlineStyle': styleSetter('outlineStyle'),
  'style.outlineWidth': styleSetter('outlineWidth'),
  'style.overflow': styleSetter('overflow'),
  'style.overflowStyle': styleSetter('overflowStyle'),
  'style.overflowWrap': styleSetter('overflowWrap'),
  'style.overflowX': styleSetter('overflowX'),
  'style.overflowY': styleSetter('overflowY'),
  'style.padding': styleSetter('padding'),
  'style.paddingBottom': styleSetter('paddingBottom'),
  'style.paddingLeft': styleSetter('paddingLeft'),
  'style.paddingRight': styleSetter('paddingRight'),
  'style.paddingTop': styleSetter('paddingTop'),
  'style.page': styleSetter('page'),
  'style.pageBreakAfter': styleSetter('pageBreakAfter'),
  'style.pageBreakBefore': styleSetter('pageBreakBefore'),
  'style.pageBreakInside': styleSetter('pageBreakInside'),
  'style.pause': styleSetter('pause'),
  'style.pauseAfter': styleSetter('pauseAfter'),
  'style.pauseBefore': styleSetter('pauseBefore'),
  'style.perspective': styleSetter('perspective'),
  'style.perspectiveOrigin': styleSetter('perspectiveOrigin'),
  'style.pitch': styleSetter('pitch'),
  'style.pitchRange': styleSetter('pitchRange'),
  'style.placeContent': styleSetter('placeContent'),
  'style.placeItems': styleSetter('placeItems'),
  'style.placeSelf': styleSetter('placeSelf'),
  'style.playDuring': styleSetter('playDuring'),
  'style.pointerEvents': styleSetter('pointerEvents'),
  'style.polarAnchor': styleSetter('polarAnchor'),
  'style.polarAngle': styleSetter('polarAngle'),
  'style.polarDistance': styleSetter('polarDistance'),
  'style.polarOrigin': styleSetter('polarOrigin'),
  'style.position': styleSetter('position'),
  'style.presentationLevel': styleSetter('presentationLevel'),
  'style.quotes': styleSetter('quotes'),
  'style.regionFragment': styleSetter('regionFragment'),
  'style.resize': styleSetter('resize'),
  'style.rest': styleSetter('rest'),
  'style.restAfter': styleSetter('restAfter'),
  'style.restBefore': styleSetter('restBefore'),
  'style.richness': styleSetter('richness'),
  'style.right': styleSetter('right'),
  'style.rotation': styleSetter('rotation'),
  'style.rotationPoint': styleSetter('rotationPoint'),
  'style.rubyAlign': styleSetter('rubyAlign'),
  'style.rubyMerge': styleSetter('rubyMerge'),
  'style.rubyPosition': styleSetter('rubyPosition'),
  'style.running': styleSetter('running'),
  'style.scrollBehavior': styleSetter('scrollBehavior'),
  'style.scrollPadding': styleSetter('scrollPadding'),
  'style.scrollPaddingBlock': styleSetter('scrollPaddingBlock'),
  'style.scrollPaddingBlockEnd': styleSetter('scrollPaddingBlockEnd'),
  'style.scrollPaddingBlockStart': styleSetter('scrollPaddingBlockStart'),
  'style.scrollPaddingBottom': styleSetter('scrollPaddingBottom'),
  'style.scrollPaddingInline': styleSetter('scrollPaddingInline'),
  'style.scrollPaddingInlineEnd': styleSetter('scrollPaddingInlineEnd'),
  'style.scrollPaddingInlineStart': styleSetter('scrollPaddingInlineStart'),
  'style.scrollPaddingLeft': styleSetter('scrollPaddingLeft'),
  'style.scrollPaddingRight': styleSetter('scrollPaddingRight'),
  'style.scrollPaddingTop': styleSetter('scrollPaddingTop'),
  'style.scrollSnapAlign': styleSetter('scrollSnapAlign'),
  'style.scrollSnapMargin': styleSetter('scrollSnapMargin'),
  'style.scrollSnapMarginBlock': styleSetter('scrollSnapMarginBlock'),
  'style.scrollSnapMarginBlockEnd': styleSetter('scrollSnapMarginBlockEnd'),
  'style.scrollSnapMarginBlockStart': styleSetter('scrollSnapMarginBlockStart'),
  'style.scrollSnapMarginBottom': styleSetter('scrollSnapMarginBottom'),
  'style.scrollSnapMarginInline': styleSetter('scrollSnapMarginInline'),
  'style.scrollSnapMarginInlineEnd': styleSetter('scrollSnapMarginInlineEnd'),
  'style.scrollSnapMarginInlineStart': styleSetter(
    'scrollSnapMarginInlineStart',
  ),
  'style.scrollSnapMarginLeft': styleSetter('scrollSnapMarginLeft'),
  'style.scrollSnapMarginRight': styleSetter('scrollSnapMarginRight'),
  'style.scrollSnapMarginTop': styleSetter('scrollSnapMarginTop'),
  'style.scrollSnapStop': styleSetter('scrollSnapStop'),
  'style.scrollSnapType': styleSetter('scrollSnapType'),
  'style.shapeImageThreshold': styleSetter('shapeImageThreshold'),
  'style.shapeInside': styleSetter('shapeInside'),
  'style.shapeMargin': styleSetter('shapeMargin'),
  'style.shapeOutside': styleSetter('shapeOutside'),
  'style.shapeRendering': styleSetter('shapeRendering'),
  'style.size': styleSetter('size'),
  'style.speak': styleSetter('speak'),
  'style.speakAs': styleSetter('speakAs'),
  'style.speakHeader': styleSetter('speakHeader'),
  'style.speakNumeral': styleSetter('speakNumeral'),
  'style.speakPunctuation': styleSetter('speakPunctuation'),
  'style.speechRate': styleSetter('speechRate'),
  'style.stopColor': styleSetter('stopColor'),
  'style.stopOpacity': styleSetter('stopOpacity'),
  'style.stress': styleSetter('stress'),
  'style.stringSet': styleSetter('stringSet'),
  'style.stroke': styleSetter('stroke'),
  'style.strokeAlignment': styleSetter('strokeAlignment'),
  'style.strokeDashadjust': styleSetter('strokeDashadjust'),
  'style.strokeDasharray': styleSetter('strokeDasharray'),
  'style.strokeDashcorner': styleSetter('strokeDashcorner'),
  'style.strokeDashoffset': styleSetter('strokeDashoffset'),
  'style.strokeLinecap': styleSetter('strokeLinecap'),
  'style.strokeLinejoin': styleSetter('strokeLinejoin'),
  'style.strokeMiterlimit': styleSetter('strokeMiterlimit'),
  'style.strokeOpacity': styleSetter('strokeOpacity'),
  'style.strokeWidth': styleSetter('strokeWidth'),
  'style.tableLayout': styleSetter('tableLayout'),
  'style.tabSize': styleSetter('tabSize'),
  'style.textAlign': styleSetter('textAlign'),
  'style.textAlignAll': styleSetter('textAlignAll'),
  'style.textAlignLast': styleSetter('textAlignLast'),
  'style.textAnchor': styleSetter('textAnchor'),
  'style.textCombineUpright': styleSetter('textCombineUpright'),
  'style.textDecoration': styleSetter('textDecoration'),
  'style.textDecorationColor': styleSetter('textDecorationColor'),
  'style.textDecorationLine': styleSetter('textDecorationLine'),
  'style.textDecorationSkip': styleSetter('textDecorationSkip'),
  'style.textDecorationStyle': styleSetter('textDecorationStyle'),
  'style.textEmphasis': styleSetter('textEmphasis'),
  'style.textEmphasisColor': styleSetter('textEmphasisColor'),
  'style.textEmphasisPosition': styleSetter('textEmphasisPosition'),
  'style.textEmphasisStyle': styleSetter('textEmphasisStyle'),
  'style.textIndent': styleSetter('textIndent'),
  'style.textJustify': styleSetter('textJustify'),
  'style.textOrientation': styleSetter('textOrientation'),
  'style.textOverflow': styleSetter('textOverflow'),
  'style.textRendering': styleSetter('textRendering'),
  'style.textShadow': styleSetter('textShadow'),
  'style.textSpaceCollapse': styleSetter('textSpaceCollapse'),
  'style.textSpaceTrim': styleSetter('textSpaceTrim'),
  'style.textSpacing': styleSetter('textSpacing'),
  'style.textTransform': styleSetter('textTransform'),
  'style.textUnderlinePosition': styleSetter('textUnderlinePosition'),
  'style.textWrap': styleSetter('textWrap'),
  'style.top': styleSetter('top'),
  'style.transform': styleSetter('transform'),
  'style.transformBox': styleSetter('transformBox'),
  'style.transformOrigin': styleSetter('transformOrigin'),
  'style.transformStyle': styleSetter('transformStyle'),
  'style.transition': styleSetter('transition'),
  'style.transitionDelay': styleSetter('transitionDelay'),
  'style.transitionDuration': styleSetter('transitionDuration'),
  'style.transitionProperty': styleSetter('transitionProperty'),
  'style.transitionTimingFunction': styleSetter('transitionTimingFunction'),
  'style.unicodeBidi': styleSetter('unicodeBidi'),
  'style.userSelect': styleSetter('userSelect'),
  'style.verticalAlign': styleSetter('verticalAlign'),
  'style.visibility': styleSetter('visibility'),
  'style.voiceBalance': styleSetter('voiceBalance'),
  'style.voiceDuration': styleSetter('voiceDuration'),
  'style.voiceFamily': styleSetter('voiceFamily'),
  'style.voicePitch': styleSetter('voicePitch'),
  'style.voiceRange': styleSetter('voiceRange'),
  'style.voiceRate': styleSetter('voiceRate'),
  'style.voiceStress': styleSetter('voiceStress'),
  'style.voiceVolume': styleSetter('voiceVolume'),
  'style.volume': styleSetter('volume'),
  'style.whiteSpace': styleSetter('whiteSpace'),
  'style.widows': styleSetter('widows'),
  'style.width': styleSetter('width'),
  'style.willChange': styleSetter('willChange'),
  'style.wordBreak': styleSetter('wordBreak'),
  'style.wordSpacing': styleSetter('wordSpacing'),
  'style.wordWrap': styleSetter('wordWrap'),
  'style.wrapAfter': styleSetter('wrapAfter'),
  'style.wrapBefore': styleSetter('wrapBefore'),
  'style.wrapFlow': styleSetter('wrapFlow'),
  'style.wrapInside': styleSetter('wrapInside'),
  'style.wrapThrough': styleSetter('wrapThrough'),
  'style.writingMode': styleSetter('writingMode'),
  'style.zIndex': styleSetter('zIndex'),
  'style.WebkitTapHighlightColor': (_, element, value) => {
    element.attributes.style.webkitTapHighlightColor = value;
  },
};

const TEXT_CONTENT_VANITIES = {
  content: (_, element, value) => {
    element.children = [value + ''];
  },
};

function attributeSetter(prop) {
  return function (name, element, value) {
    element.attributes[prop] = value;
  };
}

const PRESENTATION_VANITIES = {
  alignmentBaseline: attributeSetter('alignmentBaseline'),
  baselineShift: attributeSetter('baselineShift'),
  clipPath: attributeSetter('clipPath'),
  clipRule: attributeSetter('clipRule'),
  clip: attributeSetter('clip'),
  colorInterpolationFilters: attributeSetter('colorInterpolationFilters'),
  colorInterpolation: attributeSetter('colorInterpolation'),
  colorProfile: attributeSetter('colorProfile'),
  colorRendering: attributeSetter('colorRendering'),
  color: attributeSetter('color'),
  cursor: attributeSetter('cursor'),
  direction: attributeSetter('direction'),
  display: attributeSetter('display'),
  dominantBaseline: attributeSetter('dominantBaseline'),
  enableBackground: attributeSetter('enableBackground'),
  fillOpacity: attributeSetter('fillOpacity'),
  fillRule: attributeSetter('fillRule'),
  fill: attributeSetter('fill'),
  filter: attributeSetter('filter'),
  floodColor: attributeSetter('floodColor'),
  floodOpacity: attributeSetter('floodOpacity'),
  fontFamily: attributeSetter('fontFamily'),
  fontSizeAdjust: attributeSetter('fontSizeAdjust'),
  fontSize: attributeSetter('fontSize'),
  fontStretch: attributeSetter('fontStretch'),
  fontStyle: attributeSetter('fontStyle'),
  fontVariant: attributeSetter('fontVariant'),
  fontWeight: attributeSetter('fontWeight'),
  glyphOrientationHorizontal: attributeSetter('glyphOrientationHorizontal'),
  glyphOrientationVertical: attributeSetter('glyphOrientationVertical'),
  imageRendering: attributeSetter('imageRendering'),
  kerning: attributeSetter('kerning'),
  letterSpacing: attributeSetter('letterSpacing'),
  lightingColor: attributeSetter('lightingColor'),
  markerEnd: attributeSetter('markerEnd'),
  markerMid: attributeSetter('markerMid'),
  markerStart: attributeSetter('markerStart'),
  mask: attributeSetter('mask'),
  // Special snowflake opacity needs to have its opacity layout property set
  // as opposed to its element attribute so the renderer can make a decision about
  // where to put it based on the rendering medium's rules
  opacity: (_, element, value) => {
    element.layout.opacity = value;
  },
  overflow: attributeSetter('overflow'),
  pointerEvents: attributeSetter('pointerEvents'),
  shapeRendering: attributeSetter('shapeRendering'),
  stopColor: attributeSetter('stopColor'),
  stopOpacity: attributeSetter('stopOpacity'),
  strokeDasharray: attributeSetter('strokeDasharray'),
  strokeDashoffset: attributeSetter('strokeDashoffset'),
  strokeLinecap: attributeSetter('strokeLinecap'),
  strokeLinejoin: attributeSetter('strokeLinejoin'),
  strokeMiterlimit: attributeSetter('strokeMiterlimit'),
  strokeOpacity: attributeSetter('strokeOpacity'),
  strokeWidth: attributeSetter('strokeWidth'),
  stroke: attributeSetter('stroke'),
  textAnchor: attributeSetter('textAnchor'),
  textDecoration: attributeSetter('textDecoration'),
  textRendering: attributeSetter('textRendering'),
  unicodeBidi: attributeSetter('unicodeBidi'),
  visibility: attributeSetter('visibility'),
  wordSpacing: attributeSetter('wordSpacing'),
  writingMode: attributeSetter('writingMode'),
};

const FILTER_VANITIES = {
  x: attributeSetter('x'),
  y: attributeSetter('y'),
  width: attributeSetter('width'),
  height: attributeSetter('height'),
  filterRes: attributeSetter('filterRes'),
  filterUnits: attributeSetter('filterUnits'),
  primitiveUnits: attributeSetter('primitiveUnits'),
};

const HTML_STYLE_SHORTHAND_VANITIES = {};

const CONTROL_FLOW_VANITIES = {
  // 'controlFlow.if': function (name, element, value) {
  //   // TODO
  // },
  // 'controlFlow.repeat': function (
  //   name,
  //   element,
  //   value,
  //   context,
  //   component) {
  //   // Convert our input format flexibly into our expected format, an array
  //   var behaviors
  //   if (value === null || value === undefined || value === '' || value === true) {
  //     // These signals mean 'no repeat' i.e. 'just the element itself' which means
  //     // we populate the behaviors with just one empty object indicating no repeat info.
  //     // If the behaviors array were empty then the original element wouldn't appear at all
  //     behaviors = [{}]
  //   } else if (Array.isArray(value)) {
  //     behaviors = value
  //   } else if (typeof value === 'number' && value >= 0 && value < Infinity) {
  //     value = parseInt(value, 10) // May as well cast to integer just in case
  //     behaviors = []
  //     for (var i = 0; i < value; i++) {
  //       behaviors[i] = {} // Empty payload, just a numeric repeat
  //     }
  //   } else if (value === false) {
  //     behaviors = [] // No repeat, i.e. an empty array
  //   } else if (value && typeof value === 'object') { // Why not?
  //     behaviors = []
  //     for (var key in value) {
  //       behaviors.push(value)
  //     }
  //   }
  //   controlFlowRepeatImpl(element, behaviors, context, component)
  // },
  // 'controlFlow.yield': function (name, element, value) {
  //   // TODO
  // },
  'controlFlow.placeholder': (
    name,
    element,
    value,
    context,
    component,
  ) => {
    if (value === null || value === undefined) {
      return void 0;
    }

    if (typeof value !== 'number' && typeof value !== 'string') {
      return void 0;
    }

    let surrogates;

    // Surrogates can be passed in as React children (an array) or as an object
    // of key/value pairs; in any event we will key-map using the passed value.
    if (context.config.children) {
      surrogates = Array.isArray(context.config.children)
        ? context.config.children
        : [context.config.children];
    } else if (context.config.placeholder) {
      surrogates = context.config.placeholder;
    }

    if (!surrogates) {
      return void 0;
    }

    const surrogate = surrogates[value];

    if (surrogate === null || surrogate === undefined) {
      return void 0;
    }

    // If we have a surrogate, then we must clear the children, otherwise we will often
    // see a flash of the default content before the injected content flows in lazily
    element.children = [];

    // If we are running via a framework adapter, allow that framework to provide its own placeholder mechanism.
    // This is necessary e.g. in React where their element format needs to be converted into our 'mana' format
    if (context.config.vanities['controlFlow.placeholder']) {
      context.config.vanities['controlFlow.placeholder'](
        element,
        surrogate,
        value,
        context,
        component,
      );
    } else {
      controlFlowPlaceholderImpl(element, surrogate, component);
    }
  },
};

// function getIndexOfElementInParent (element, parent) {
//   if (!parent.children) {
//     return -1
//   }
//   for (var i = 0; i < parent.children.length; i++) {
//     if (parent.children[i] === element) {
//       return i
//     }
//   }
//   return -1
// }

// function controlFlowRepeatImpl (element, behaviors, context, component) {
//   if (!element.__parent) {
//     warnOnce('cannot do `controlFlow.repeat` on an element with no parent')
//     return void (0)
//   }
//   // We need to track repeats so we can revert to the original repeat when necessary
//   if (!element.__parent.__repeats) {
//     element.__parent.__repeats = {}
//   }
//   // We'll store the original element for reference keyed by its flexible id
//   var flexId = element.attributes['haiku-id'] || element.attributes.id
//   if (!element.__parent.__repeats[flexId]) {
//     element.__parent.__repeats[flexId] = {
//       originalElement: element,
//       originalIndex: getIndexOfElementInParent(element, element.__parent)
//     }
//   }
//   // We'll use the original repeat info to decide how to handle the repeat
//   var repeatInfo = element.__parent.repeats[flexId]
//   // Get the index of the first matching element in the collection
//   var firstIndex = getIndexOfElementInParent(element, element.__parent)
//   // And also cache the behaviors that are going to apply to it
//   for (var i = 0; i < element.__parent.children.length; i++) {
//     var child = element.__parent.children[i]
//   }
// }

function controlFlowPlaceholderImpl(element, surrogate, component) {
  if (!component._didElementRenderSurrogate(element, surrogate)) {
    element.elementName = surrogate.elementName;
    element.children = surrogate.children || [];
    if (surrogate.attributes) {
      if (!element.attributes) {
        element.attributes = {};
      }
      for (const key in surrogate.attributes) {
        if (key === 'haiku-id') {
          continue;
        }
        element.attributes[key] = surrogate.attributes[key];
      }
    }
    component._markElementSurrogateAsRendered(element, surrogate);
  }
}

// var warnings = {}
// function warnOnce (msg) {
//   if (!warnings[msg]) {
//     console.warn('[haiku player] ' + msg)
//     warnings[msg] = true
//   }
// }

export default {
  'missing-glyph': has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  a: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES,
    STYLE_VANITIES,
  ),
  abbr: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  acronym: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
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
  article: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  aside: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  audio: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  b: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  base: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  basefont: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  bdi: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  bdo: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  big: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  blockquote: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  body: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  br: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  button: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  canvas: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  caption: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  center: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  circle: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  cite: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  clipPath: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  code: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  col: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  colgroup: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  'color-profile': has(),
  command: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  cursor: has(),
  datalist: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dd: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  defs: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  del: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  desc: has(),
  details: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dfn: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dir: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  discard: has(),
  div: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  dl: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  dt: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  ellipse: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  em: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
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
  filter: has(LAYOUT_3D_VANITIES, FILTER_VANITIES),
  'font-face': has(),
  'font-face-format': has(),
  'font-face-name': has(),
  'font-face-src': has(),
  'font-face-uri': has(),
  font: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES,
    STYLE_VANITIES,
  ),
  footer: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  foreignObject: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  form: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  frame: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  frameset: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  g: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  glyph: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  glyphRef: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  h1: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  h2: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  h3: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  h4: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  h5: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  h6: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  hatch: has(),
  hatchpath: has(),
  head: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  header: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  hgroup: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  hkern: has(),
  hr: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  html: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  i: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  iframe: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  image: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  img: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  input: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  ins: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  kbd: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  keygen: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  label: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  legend: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  li: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  line: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  linearGradient: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES,
  ),
  link: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  map: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  mark: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  marker: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  mask: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  menu: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
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
  noscript: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  object: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ol: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  optgroup: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  option: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  output: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  p: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  param: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  path: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  pattern: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  polygon: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  polyline: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  pre: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  progress: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  q: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  radialGradient: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  rect: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  rp: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  rt: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ruby: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  s: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  samp: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  script: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  section: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  select: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  set: has(),
  small: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  solidcolor: has(),
  source: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  span: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  stop: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  strike: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  strong: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  style: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  sub: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  summary: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  sup: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  svg: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES,
    STYLE_VANITIES,
    HTML_STYLE_SHORTHAND_VANITIES,
  ),
  switch: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  symbol: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  table: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  tbody: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  td: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  text: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES,
  ),
  textarea: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  textPath: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES,
  ),
  tfoot: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  th: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  thead: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  time: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  title: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  tr: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  track: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  tref: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  tspan: has(
    TEXT_CONTENT_VANITIES,
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES,
  ),
  tt: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  u: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES,
  ),
  ul: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  unknown: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  us: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  use: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  var: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  video: has(HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  view: has(),
  vkern: has(),
  wb: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
};
