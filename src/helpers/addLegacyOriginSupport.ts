/**
 * Prior to explicit origin support, we were applying a default origin of (0, 0, 0) for all objects, then allowing
 * the browser default for SVG elements (50%, 50%, 0px) be the effective transform-origin. This led to
 * inaccuracies in the layout system, specifically related to addressing translation on SVG elements and addressing
 * origin in general. Since as of the introduction of explicit origin support we had not made layout mount
 * addressable in Haiku, we can "backport" to the old coordinate system by simply offsetting layout mount by its
 * "origin error".
 * @param isSvg
 * @param rawLayout
 * @param parentSize
 * @param propertyGroup
 */
const addLegacyOriginSupport = (isSvg: boolean, rawLayout, parentSize, propertyGroup) => {
  if (!propertyGroup) {
    return;
  }

  // If we have changes to make, recompute layout in case we never flush again.
  if (isSvg) {
    propertyGroup['mount.x'] = {0: {value: rawLayout.mount.x - 0.5}};
    propertyGroup['mount.y'] = {0: {value: rawLayout.mount.y - 0.5}};
  } else if (rawLayout.origin.x !== 0 || rawLayout.origin.y !== 0 || rawLayout.origin.z !== 0) {
    propertyGroup['mount.x'] = {0: {value: rawLayout.mount.x - rawLayout.origin.x}};
    propertyGroup['mount.y'] = {0: {value: rawLayout.mount.y - rawLayout.origin.y}};
    propertyGroup['mount.z'] = {0: {value: rawLayout.mount.z - rawLayout.origin.z}};
  }
};

export default addLegacyOriginSupport;
