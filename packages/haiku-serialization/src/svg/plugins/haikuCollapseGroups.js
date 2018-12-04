/* tslint:disable */

/**
 * Fork of original svgo rule.
 * @see {@link https://github.com/svg/svgo/blob/master/plugins/collapseGroups.js}
 * TODO: contribute this back to main project and remove this plugin.
 * The only change is the addition of ` && !g.hasAttr('filter')` on line 65.
 */

'use strict';

exports.type = 'perItemReverse';

exports.active = true;

exports.description = 'collapses useless groups';

let collections = require('svgo/plugins/_collections'),
  attrsInheritable = collections.inheritableAttrs,
  animationElems = collections.elemsGroups.animation;

function hasAnimatedAttr (item) {
  /* jshint validthis:true */
  return item.isElem(animationElems) && item.hasAttr('attributeName', this) ||
    !item.isEmpty() && item.content.some(hasAnimatedAttr, this);
}

/*
 * Collapse useless groups.
 *
 * @example
 * <g>
 *     <g attr1="val1">
 *         <path d="..."/>
 *     </g>
 * </g>
 *         ⬇
 * <g>
 *     <g>
 *         <path attr1="val1" d="..."/>
 *     </g>
 * </g>
 *         ⬇
 * <path attr1="val1" d="..."/>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function (item) {

  // non-empty elements
  if (item.isElem() && (!item.isElem('switch') || isFeaturedSwitch(item)) && !item.isEmpty()) {
    item.content.forEach(function (g, i) {
      // non-empty groups
      if (g.isElem('g') && !g.isEmpty()) {
        // move group attibutes to the single content element
        if (g.hasAttr() && g.content.length === 1) {
          const inner = g.content[0];

          if (inner.isElem() && !inner.hasAttr('id') &&
            !(g.hasAttr('class') && inner.hasAttr('class')) && (
              !g.hasAttr('clip-path') && !g.hasAttr('mask') ||
              inner.isElem('g') && !g.hasAttr('transform') && !inner.hasAttr('transform') && !g.hasAttr('filter')
            )
          ) {
            g.eachAttr(function (attr) {
              if (g.content.some(hasAnimatedAttr, attr.name)) {
                return;
              }

              if (!inner.hasAttr(attr.name)) {
                inner.addAttr(attr);
              } else if (attr.name == 'transform') {
                inner.attr(attr.name).value = attr.value + ' ' + inner.attr(attr.name).value;
              } else if (inner.hasAttr(attr.name, 'inherit')) {
                inner.attr(attr.name).value = attr.value;
              } else if (
                attrsInheritable.indexOf(attr.name) < 0 &&
                !inner.hasAttr(attr.name, attr.value)
              ) {
                return;
              }

              g.removeAttr(attr.name);
            });
          }
        }

        // collapse groups without attributes
        if (!g.hasAttr() && !g.content.some(function (item) {
          return item.isElem(animationElems);
        })) {
          item.spliceContent(i, 1, g.content);
        }
      } else if (isFeaturedSwitch(g)) {
        item.spliceContent(i, 1, g.content);
      }
    });
  }
};

function isFeaturedSwitch (elem) {
  return elem.isElem('switch') && !elem.isEmpty() && !elem.content.some(child =>
    child.hasAttr('systemLanguage') || child.hasAttr('requiredFeatures') || child.hasAttr('requiredExtensions'),
  );
}
