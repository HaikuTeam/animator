import {obfuscate, unobfuscate} from '@sdk-creator/utils/crypto';
import * as tape from 'tape';

tape('obfuscation', (test) => {
  const obfuscated = obfuscate({foo: 'bar'});
  test.equal(obfuscated.key, 'fKc9PKZJg>', 'obfuscation returns expected key');
  test.deepEqual(unobfuscate(obfuscated), {foo: 'bar'}, 'unobfuscation returns expected original');
  obfuscated.key = 'a'.repeat(obfuscated.key.length);
  test.throws(() => unobfuscate(obfuscated), 'unobfuscation with a tampered object throws');
  test.end();
});
