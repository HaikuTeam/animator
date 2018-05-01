const HAIKU_CONFIG_PROPS_RENAME_MAPPING = {
  haikuOptions: 'options',
  haikuStates: 'states',
  haikuInitialStates: 'states',
  haikuEventHandlers: 'eventHandlers',
  haikuTimelines: 'timelines',
  haikuVanities: 'vanities',
};

/**
 * Parses a specific property specified by `verboseKeyName` from the `props`
 * object, renaming and merging legacy props as necessary.
 * This method is mainly used by the React and Vue adapters.
 * @param props
 * @param verboseKeyName
 * @returns {Object}
 */

const getParsedProperty = (props, verboseKeyName) => {
  const result = {};

  const haikuConfigRemappedKey = HAIKU_CONFIG_PROPS_RENAME_MAPPING[verboseKeyName];

  const haikuConfigFinalKey = haikuConfigRemappedKey || verboseKeyName;

  // Special case: Options used to be a separate object, so if we see this legacy
  // format, just merge it in with the root level of the new options
  if (haikuConfigFinalKey === 'options') {
    for (const optionsSubKey in props[verboseKeyName]) {
      result[optionsSubKey] = props[verboseKeyName][optionsSubKey];
    }
  } else {
    result[haikuConfigFinalKey] = props[verboseKeyName];
  }

  return result;
};

export default getParsedProperty;
