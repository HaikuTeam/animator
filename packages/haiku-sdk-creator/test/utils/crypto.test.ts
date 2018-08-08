import {obfuscate, unobfuscate} from '@sdk-creator/utils/crypto';
import * as tape from 'tape';

tape('obfuscation', (test) => {
  const obfuscated = obfuscate({foo: 'bar'});
  const [key] = obfuscated;
  test.equal(key, 'fKc9PKZJg>', 'obfuscation returns expected key');
  test.deepEqual(unobfuscate(obfuscated), {foo: 'bar'}, 'unobfuscation returns expected original');
  obfuscated[0] = 'a'.repeat(key.length);
  test.deepEqual(unobfuscate(obfuscated), {}, 'unobfuscation with a tampered object resolves to an empty object');
  test.end();
});
