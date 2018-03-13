import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {evaluateInjectedFunctionInExportContext} from '../injectables';

export class HaikuStaticExporter extends BaseExporter implements ExporterInterface {
  /**
   * Whether we have already parsed the bytecode passed to the object on construction.
   * @type {boolean}
   */
  private bytecodeParsed = false;

  /**
   * Parses class-local bytecode using internal methods.
   *
   * Essentially replaces all non-scalar timeline values with the equivalent scalar value of edit mode.
   */
  private parseBytecode() {
    this.visitAllTimelineProperties((timeline, property) => {
      const timelineProperty = timeline[property];
      for (const keyframe in timelineProperty) {
        const {value} = timelineProperty[keyframe];
        if (typeof value !== 'function') {
          continue;
        }

        timelineProperty[keyframe] = {
          value: evaluateInjectedFunctionInExportContext(value, this.bytecode.states || {}),
        };
      }
    });
  }

  /**
   * Interface method to provide raw output.
   * @returns {{}}
   */
  rawOutput() {
    if (!this.bytecodeParsed) {
      this.parseBytecode();
    }

    // Put bytecode through the JSON wringer to ensure our output is pure.
    return JSON.parse(JSON.stringify(this.bytecode));
  }

  /**
   * Interface method to provide binary output.
   * @returns {{}}
   */
  binaryOutput() {
    return JSON.stringify(this.bytecode);
  }

  /**
   * Interface method to provide failsafe binary output.
   * @returns {{}}
   */
  failsafeBinaryOutput() {
    return '{}';
  }

  constructor(protected bytecode) {
    super(bytecode);
  }
}
