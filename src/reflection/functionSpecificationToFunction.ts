/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import marshalParams from "./marshalParams"

export default function functionSpecificationToFunction(name, params, body, type) {
  if (!type) type = "FunctionExpression"

  params = marshalParams(params)
  let fn

  if (type === "ArrowFunctionExpression") {
    fn = new Function( // eslint-disable-line
      "\n" +
        "return " +
        (name || "") +
        "(" +
        params +
        ") => {\n" +
        "  " +
        (body || "") +
        "\n" +
        "}\n",
    )()
  } else {
    fn = new Function( // eslint-disable-line
      "\n" +
        "return function " +
        (name || "") +
        "(" +
        params +
        ") {\n" +
        "  " +
        (body || "") +
        "\n" +
        "}\n",
    )()
  }

  return fn
}
