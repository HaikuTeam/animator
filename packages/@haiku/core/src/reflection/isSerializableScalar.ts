/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const STRING = 'string';
const NUMBER = 'number';
const BOOLEAN = 'boolean';

export default function isSerializableScalar (value) {
  return (
    value === null ||
    typeof value === NUMBER ||
    typeof value === STRING ||
    typeof value === BOOLEAN
  );
}
