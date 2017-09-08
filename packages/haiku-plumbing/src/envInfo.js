import path from 'path'
import { argv } from 'yargs'
import { clone } from 'lodash'

export default function envInfo () {
  const args = clone(argv._)
  const subcommand = args.shift()
  const flags = clone(argv)
  delete flags._
  delete flags.$0

  let folder = flags.folder
  if (folder && folder[0] !== path.sep) {
    if (path.resolve(folder) !== folder) {
      folder = path.join(process.cwd(), folder || '.')
    }
  }

  let socket = flags.socket || {}

  // Let the user specify --port=1234
  if (flags.port) {
    socket.port = flags.port
  }

  // Let the user specify --host=0.0.0.0
  if (flags.host) {
    socket.host = flags.host
  }

  let out = { args, subcommand, flags, folder, socket }

  return out
}
