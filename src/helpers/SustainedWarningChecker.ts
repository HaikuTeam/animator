/**
 * @file Check and store SustainedWarning from HaikuComponent 
 *       (eg. identifier not found on an expression)
 */


import HaikuComponent from './../HaikuComponent';
import {BytecodeTimelines} from './../api/HaikuBytecode';

export enum SustainedWarningKind {
    IdentifierNotFound,
  }
  
export type SustainedWarning = {
  bytecodeLocation: string[];
  type: SustainedWarningKind;
  identifier?: string;
  file?: string;
  line?: number;
};


export default class SustainedWarningChecker {

  // Store sustainedWarnings
  private sustainedWarnings: SustainedWarning[] = [];
  
  constructor(private readonly component: HaikuComponent) {}


  /**
   * Transverse injected HaikuBytecode and check if all injected 
   * functions parameters are known
   */
  checkIdentifierNotFound() {
    const bytecodeTimeline = this.component.bytecode.timelines;

    const injectables = Object.keys(this.component.getInjectables());

    const warnings: SustainedWarning[] = [];

    // Transverse timeline properties and check if value is a function
    for (const timelineName in bytecodeTimeline) {
      for (const componentId in bytecodeTimeline[timelineName]) {
        for (const propertyName in bytecodeTimeline[timelineName][componentId]) {
          for (const keyframeMs in bytecodeTimeline[timelineName][componentId][propertyName]) {
            const maybeFunc = bytecodeTimeline[timelineName][componentId][propertyName][keyframeMs];
            if (typeof maybeFunc.value === 'function') {
              const funcParams = maybeFunc.value.specification.params;
              
              funcParams.forEach((param) => {
                // If function parameter param is not found in injectables list, create a 
                // SustainedWarning with type SustainedWarningKind.IdentifierNotFound
                if (injectables.indexOf(param) < 0) {
                  const warning: SustainedWarning = {
                    bytecodeLocation: ['timelines', timelineName, componentId, propertyName, keyframeMs], 
                    type: SustainedWarningKind.IdentifierNotFound,
                    identifier: param,
                  };
                  warnings.push(warning);
                } 
              }); 
            }
          }
        }
      }
    }
    this.sustainedWarnings.push(...warnings);

    return this.sustainedWarnings;
  }

  checkAndGetAllSustainedWarnings(): SustainedWarning[] {
    this.checkIdentifierNotFound();
    return this.sustainedWarnings;
  }

  getAllCachedSustainedWarnings(): SustainedWarning[] {
    return this.sustainedWarnings;
  }


  isIdentifierMissing(identifier: string): boolean {
    for (let i = 0; i < this.sustainedWarnings.length; i++) {
      const sustainedWarning = this.sustainedWarnings[i];
      if (sustainedWarning.type === SustainedWarningKind.IdentifierNotFound && 
          sustainedWarning.identifier === identifier) {
        return true;
      }
    }
    return false;
  }
}
