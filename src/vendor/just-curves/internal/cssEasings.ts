/**
 * The MIT License
 * 
 * Copyright (c) justanimate
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

const c = `cubic-bezier`;
const s = `steps`;

export const ease = c + `(.25,.1,.25,1)`;
export const easeIn = c + `(.42,0,1,1)`;
export const easeInBack = c + `(.6,-.28,.735,.045)`;
export const easeInCirc = c + `(.6,.04,.98,.335)`;
export const easeInCubic = c + `(.55,.055,.675,.19)`;
export const easeInExpo = c + `(.95,.05,.795,.035)`;
export const easeInOut = c + `(.42,0,.58,1)`;
export const easeInOutBack = c + `(.68,-.55,.265,1.55)`;
export const easeInOutCirc = c + `(.785,.135,.15,.86)`;
export const easeInOutCubic = c + `(.645,.045,.355,1)`;
export const easeInOutExpo = c + `(1,0,0,1)`;
export const easeInOutQuad = c + `(.455,.03,.515,.955)`;
export const easeInOutQuart = c + `(.77,0,.175,1)`;
export const easeInOutQuint = c + `(.86,0,.07,1)`;
export const easeInOutSine = c + `(.445,.05,.55,.95)`;
export const easeInQuad = c + `(.55,.085,.68,.53)`;
export const easeInQuart = c + `(.895,.03,.685,.22)`;
export const easeInQuint = c + `(.755,.05,.855,.06)`;
export const easeInSine = c + `(.47,0,.745,.715)`;
export const easeOut = c + `(0,0,.58,1)`;
export const easeOutBack = c + `(.175,.885,.32,1.275)`;
export const easeOutCirc = c + `(.075,.82,.165,1)`;
export const easeOutCubic = c + `(.215,.61,.355,1)`;
export const easeOutExpo = c + `(.19,1,.22,1)`;
export const easeOutQuad = c + `(.25,.46,.45,.94)`;
export const easeOutQuart = c + `(.165,.84,.44,1)`;
export const easeOutQuint = c + `(.23,1,.32,1)`;
export const easeOutSine = c + `(.39,.575,.565,1)`;
export const elegantSlowStartEnd = c + `(.175,.885,.32,1.275)`;
export const linear = c + `(0,0,1,1)`;
export const stepEnd = s + `(1,0)`;
export const stepStart = s + `(1,1)`;
