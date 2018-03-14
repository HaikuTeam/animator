import * as Template from 'haiku-serialization/src/bll/Template';
import parsers from '@haiku/core/lib/properties/dom/parsers';
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
    Template.visitTemplate(this.bytecode.template, null, (node) => {
      const properties = this.bytecode.timelines.Default[`haiku:${node.attributes['haiku-id']}`];
      for (const property in properties) {
        const timelineProperty = properties[property];
        for (const keyframe in timelineProperty) {
          const {value} = timelineProperty[keyframe];
          if (typeof value === 'function') {
            timelineProperty[keyframe] = {
              value: evaluateInjectedFunctionInExportContext(value, this.bytecode.states || {}),
            };
          }

          if (parsers[node.elementName] && parsers[node.elementName][property]) {
            timelineProperty[keyframe].value = parsers[node.elementName][property].parse(
              timelineProperty[keyframe].value);
          }
        }
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
    if (!this.bytecodeParsed) {
      this.parseBytecode();
    }

    return JSON.stringify(this.bytecode);
  }

  /**
   * Interface method to provide failsafe binary output.
   * @returns {{}}
   */
  failsafeBinaryOutput() {
    return '{}';
  }
}
