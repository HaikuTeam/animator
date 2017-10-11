import * as tape from "tape"

import { Context, Nib } from "../src/nib"
import { cli } from "../src/haiku-cli"

tape("haiku-cli:list", (t) => {
  t.plan(1)

//   let results = ""

//   const mockContext = new Context(["list"], {}, {
//     log: (output) => {
//       console.log(output)
//       results = output
//     },
//   }, true)

//   cli.run(mockContext)

//TODO:  Will probably need to mock stdin for this to work.
//       This will require mockMode logic in the read methods of Context (using inquirer)
  
  t.ok(true,"UNIMPLEMENTED")
})
