const objectToString = Object.prototype.toString;

export default function isObject(v) {
  return !!v && objectToString.call(v) === '[object Object]';
}
