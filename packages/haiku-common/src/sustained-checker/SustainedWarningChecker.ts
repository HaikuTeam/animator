/**
 * @file Check and store SustainedWarning from HaikuComponent
 *       (eg. identifier not found on an expression)
 *
 * TODO: Move this file to haiku-creator
 */
import {BytecodeSummonable} from '@haiku/core/lib/api';
import HaikuComponent from '@haiku/core/lib/HaikuComponent';

export enum SustainedWarningKind {
  IdentifierNotFound,
}

export interface SustainedWarning {
  // Bytecode location should have all nodes from Bytecode
  // root up to error eg. ['timelines','Default',... ]
  bytecodeLocation: string[];
  type: SustainedWarningKind;
  // For IdentifierNotFound kind
  identifier?: string;
  // Some warnings might include file and line
  file?: string;
  line?: number;
}

export default class SustainedWarningChecker {

  // Store identifier not found warnings
  // For each type of warning, a new list should be created (It avoids
  // checking warning types for method like isIdentifierMissing() )
  private identifierNotFoundWarnings: SustainedWarning[] = [];

  constructor (private readonly component: HaikuComponent) {}

  /**
   * Transverse injected HaikuBytecode and check if all injected
   * functions parameters are known
   */
  checkIdentifierNotFound () {
    const bytecodeTimeline = this.component.bytecode.timelines;

    const injectables = Object.keys(this.component.getInjectables());

    // Reset indentifiers not found cache
    this.identifierNotFoundWarnings = [];

    // Transverse timeline properties and check if value is a function
    for (const timelineName in bytecodeTimeline) {
      for (const componentId in bytecodeTimeline[timelineName]) {
        for (const propertyName in bytecodeTimeline[timelineName][componentId]) {
          for (const keyframeMs in bytecodeTimeline[timelineName][componentId][propertyName]) {
            const maybeFunc = bytecodeTimeline[timelineName][componentId][propertyName][keyframeMs];
            // Checks only injected (Haiku.inject) function parameters. To do a more
            // complete expression parsing, parseExpression can be used
            if (maybeFunc.value instanceof Function) {
              const funcParams = (maybeFunc.value as BytecodeSummonable).specification.params;

              funcParams.forEach((param: string) => {
                // If function parameter param is not found in injectables list, create a
                // SustainedWarning with type SustainedWarningKind.IdentifierNotFound
                if (injectables.indexOf(param) < 0) {
                  const warning: SustainedWarning = {
                    bytecodeLocation: ['timelines', timelineName, componentId, propertyName, keyframeMs],
                    type: SustainedWarningKind.IdentifierNotFound,
                    identifier: param,
                  };
                  this.identifierNotFoundWarnings.push(warning);
                }
              });
            }
          }
        }
      }
    }

    return this.identifierNotFoundWarnings;
  }

  /**
   * Execute sustained warnings. Each sustained warning check caches results
   */
  checkAndGetAllSustainedWarnings (): SustainedWarning[] {
    // Any other sustained warning check should be included here
    this.checkIdentifierNotFound();
    return this.allCachedSustainedWarnings;
  }

  /**
   * Get sustained warning check cached results
   */
  get allCachedSustainedWarnings (): SustainedWarning[] {
    // Should concat all type of warnings
    return this.identifierNotFoundWarnings;
  }

  /**
   * Get a list of identifiers not found from checkIdentifierNotFound cache
   */
  get notFoundIdentifiers (): string[] {
    const identifierList = this.identifierNotFoundWarnings.map((warning: SustainedWarning) => warning.identifier);
    // Return unique not found identifiers
    return Array.from(new Set(identifierList));
  }
}
