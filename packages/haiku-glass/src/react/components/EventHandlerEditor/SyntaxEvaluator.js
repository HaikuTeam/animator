import React from 'react'
import parseExpression from 'haiku-serialization/src/ast/parseExpression'
import {EVALUATOR_STATES} from './constants'
import Palette from '../../Palette'
import HaikuMode from '../../modes/haiku.js'

class SyntaxEvaluator extends React.Component {
  constructor (props) {
    super(props)

    this.evaluator = this.getDefaultEvaluator()
  }

  getEvalutatorStateColor (state) {
    switch (state) {
      case EVALUATOR_STATES.WARN:
        return Palette.ORANGE
      case EVALUATOR_STATES.ERROR:
        return Palette.RED
      default:
        return Palette.PALE_GRAY
    }
  }

  getDefaultEvaluator () {
    return {
      text: null,
      state: EVALUATOR_STATES.OPEN
    }
  }

  componentWillUpdate () {
    const evaluator = this.getDefaultEvaluator()
    const wrapped = parseExpression.wrap(this.props.evaluate)
    const parse = parseExpression(wrapped, {}, HaikuMode.keywords, null, null, {
      // These checks are only needed for expressions in the timeline
      skipParamsImpurityCheck: true,
      skipForbiddensCheck: true
    })

    if (parse.error) {
      evaluator.text = parse.error.message
      evaluator.state = EVALUATOR_STATES.ERROR
    } else {
      if (parse.warnings.length > 0) {
        evaluator.text = parse.warnings[0].annotation
        evaluator.state = EVALUATOR_STATES.WARN
      }
    }

    this.evaluator = evaluator
  }

  render () {
    return (
      <span
        style={{
          ...this.props.style,
          color: this.getEvalutatorStateColor(this.evaluator.state)
        }}
      >
        {this.evaluator.text || 'No Errors'}
      </span>
    )
  }
}

SyntaxEvaluator.propTypes = {
  style: React.PropTypes.object,
  evaluate: React.PropTypes.string.isRequired
}

export default SyntaxEvaluator
