export default function clone(thing: any) {
  if (Array.isArray(thing)) {
    const arr = [];
    for (let i = 0; i < thing.length; i++) {
      arr[i] = clone(thing[i]);
    }
    return arr;
  }

  if (thing && typeof thing === 'object') {
    const obj = {};
    for (const key in thing) {
      obj[key] = clone(thing[key]);
    }
    return obj;
  }

  return thing;
}
