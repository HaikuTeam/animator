import separate from "./separate"

export default function hyphenate(name: string) {
  return separate(name, null).toLowerCase()
}
