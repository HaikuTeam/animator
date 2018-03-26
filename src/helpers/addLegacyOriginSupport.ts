/**
 * Prior to explicit origin support, we were applying a default origin of (0, 0, 0) for all objects, then allowing
 * the browser default for SVG elements (50%, 50%, 0px) be the effective transform-origin.
 * @param propertyGroup
 */
const addLegacyOriginSupport = (propertyGroup) => {
  if (!propertyGroup) {
    return;
  }

  propertyGroup['mount.x'] = {0: {value: -0.5}};
  propertyGroup['mount.y'] = {0: {value: -0.5}};
};

export default addLegacyOriginSupport;
