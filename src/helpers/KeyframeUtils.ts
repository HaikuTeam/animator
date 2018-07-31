import {BytecodeTimelineProperty} from '../api';

const sortNumeric = (a, b) => a - b;

export const getSortedKeyframes = (propertyGroup: BytecodeTimelineProperty): number[] =>
  Object.keys(propertyGroup).map(Number).sort(sortNumeric);
