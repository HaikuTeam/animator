import * as React from 'react';
import {Parser} from 'cst';
import {EVALUATOR_STATES} from './constants';
import Palette from 'haiku-ui-common/lib/Palette';

class SyntaxEvaluator extends React.PureComponent {
  constructor (props) {
    super(props);

    this.evaluator = this.getDefaultEvaluator();
  }

  getEvalutatorStateColor (state) {
    switch (state) {
      case EVALUATOR_STATES.WARN:
        return Palette.ORANGE;
      case EVALUATOR_STATES.ERROR:
        return Palette.RED;
      default:
        return Palette.PALE_GRAY;
    }
  }

  getDefaultEvaluator () {
    return {
      text: null,
      state: EVALUATOR_STATES.OPEN,
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.evaluate !== this.props.evaluate;
  }

  componentWillUpdate ({evaluate}) {
    const evaluator = this.getDefaultEvaluator();
    const parser = new Parser({
      sourceType: 'script',
      strictMode: true,
    });

    try {
      // Force strict mode on the block of code to be evaluated
      const strictEvaluate = '"use strict";' + evaluate;
      parser._parseAst(strictEvaluate);
    } catch (exception) {
      evaluator.text = exception.message;
      evaluator.state = EVALUATOR_STATES.ERROR;
    }

    this.evaluator = evaluator;
    this.props.onChange(evaluator);
  }

  render () {
    return (
      <span
        style={{
          ...this.props.style,
          color: this.getEvalutatorStateColor(this.evaluator.state),
        }}
      >
        {this.evaluator.text || 'No Errors'}
      </span>
    );
  }
}

SyntaxEvaluator.propTypes = {
  style: React.PropTypes.object,
  evaluate: React.PropTypes.string.isRequired,
};

export default SyntaxEvaluator;
