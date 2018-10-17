/** @file Generic handling for injectables through export. */
import {
  BytecodeStateType,
  BytecodeSummonable,
  HaikuBytecode,
} from '@haiku/core/lib/api';

/**
 * A class we can instantiate to act as a stub for injectables that can't be evaluated sensibly during export.
 *
 * Any instance will return itself through property access, and resolve to 0 when used as a primitive (e.g. through
 * string concatenation or arithmetic).
 * TODO: Locate and use better primitive defaults for specific injectables.
 * @private
 */
class DefaultStub {
  /**
   * The constructor returns a Proxy, which activates the generic getter for property access mutation.
   * @returns {Proxy}
   */
  constructor () {
    return new Proxy(this, this);
  }

  /**
   * Returns the Proxy through regular access, and return a 0-getter when a primitive value is requested.
   */
  get (_: any, property: any) {
    if (property === Symbol.toPrimitive) {
      return () => 1;
    }

    return new DefaultStub();
  }

  apply () {
    return new DefaultStub();
  }
}

/**
 * A value resolver compatible with results from calling `Haiku.inject`.
 *
 * @param bytecodeSummonable
 *   A timeline property value, which is assumed to be a state/summonable-injected function.
 * @param states
 *   The state tree we should evaluate parameters against.
 * @returns {any}
 */
export const evaluateInjectedFunctionInExportContext = (
  bytecodeSummonable: BytecodeSummonable,
  bytecode: HaikuBytecode,
): BytecodeStateType => {
  const states = bytecode.states || {};
  const helpers = bytecode.helpers || {};
  const defaultStub = new DefaultStub();
  const params = bytecodeSummonable.specification.params.map(
    (param: string) => {
      if (param === '$helpers') {
        return helpers;
      }
      return (global[param] || states.hasOwnProperty(param))
        ? (global[param] || states[param].value)
        : defaultStub;
    },
  );
  try {
    return bytecodeSummonable.apply(undefined, params) || 0;
  } catch (e) {
    return 0;
  }
};
