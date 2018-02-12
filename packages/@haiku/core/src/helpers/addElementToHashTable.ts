/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function addElementToHashTable(hash, realElement, virtualElement) {
  if (virtualElement && virtualElement.attributes) {
    const flexId = virtualElement.attributes['haiku-id'] || virtualElement.attributes.id;

    // Don't add if there is no id, otherwise we'll end up tracking a bunch
    // of elements all sharing a key such as `undefined` or `null` etc.
    if (flexId) {
      if (!hash[flexId]) {
        hash[flexId] = [];
      }

      let alreadyInList = false;
      for (let i = 0; i < hash[flexId].length; i++) {
        const elInList = hash[flexId][i];
        if (elInList === realElement) {
          alreadyInList = true;
        }
      }

      if (!alreadyInList) {
        hash[flexId].push(realElement);
      }
    }
  }
}
