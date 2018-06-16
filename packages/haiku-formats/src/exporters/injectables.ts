/** @file Generic handling for injectables through export. */
import functionToRFO from '@haiku/core/lib/reflection/functionToRFO';

import {
  BytecodeStates,
  BytecodeStateType,
  BytecodeSummonable,
} from '@haiku/core/lib/api/HaikuBytecode';

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
export const evaluateInjectedFunctionInExportContext = (bytecodeSummonable: BytecodeSummonable,
                                                        states: BytecodeStates): BytecodeStateType => {
  const rfo = functionToRFO(bytecodeSummonable);
  const defaultStub = new DefaultStub();
  const params = rfo.__function.params.map((param: string) => (global[param] || states.hasOwnProperty(param))
    ? (global[param] || states[param].value)
    : defaultStub,
  );
  return bytecodeSummonable.apply(undefined, params) || 0;
};
