export default function Base (_, name, contents) {
  return {
    preview: null,
    isPrimitive: true,
    fileName: name,
    contents,
  };
}
