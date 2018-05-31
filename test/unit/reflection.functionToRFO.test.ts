import * as tape from 'tape';
import functionToRFO from '@core/reflection/functionToRFO';
// Javascript test is called because Typescript compiler scrambles functions.
require('./reflection.functionToRFO.impl')(tape, functionToRFO);
