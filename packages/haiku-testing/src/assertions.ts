import {Test} from 'tape';
import {xml2js} from 'xml-js';

export const assertXmlIsEquivalent = (test: Test, xml1: string, xml2: string, message?: string) => {
  const options = {
    trim: true,
    captureSpacesBetweenElements: false,
  };

  test.deepEqual(xml2js(xml1, options), xml2js(xml2, options), message || 'xml is equivalent');
};
