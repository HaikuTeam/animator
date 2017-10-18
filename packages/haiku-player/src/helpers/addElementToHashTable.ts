export default function addElementToHashTable(hash, realElement, virtualElement) {
  if (virtualElement && virtualElement.attributes) {
    const flexId = virtualElement.attributes['haiku-id'] || virtualElement.attributes.id;

    if (!hash[flexId]) hash[flexId] = [];

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
