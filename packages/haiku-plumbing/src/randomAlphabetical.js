const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export default function randomAlphabetical (len) {
  let text = ''
  for (let i = 0; i < len; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}
