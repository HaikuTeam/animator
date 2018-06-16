import functionToRFO from '@core/reflection/functionToRFO';
import * as tape from 'tape';
// Javascript test is called because Typescript compiler scrambles functions.
require('./reflection.functionToRFO.impl')(tape, functionToRFO);
