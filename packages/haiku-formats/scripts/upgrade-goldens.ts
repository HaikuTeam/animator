import {createComponent} from '@haiku/core/test/TestHelpers';
import {each} from 'async';
// @ts-ignore
import {readdir, writeFile} from 'haiku-fs-extra';
// @ts-ignore
import * as AST from 'haiku-serialization/src/bll/AST';
import {join} from 'path';

const goldensRoot = join(global.process.cwd(), 'test/goldens');
const ast = AST.upsert({uid: 'upgrader', file: {getImportPathTo: () => {}}});

readdir(join(goldensRoot, 'bytecode'), (_: any, bytecodeFiles: string[]) => {
  each(bytecodeFiles, (filename, next) => {
    const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
    createComponent(require(bytecodeFilename), {hotEditingMode: true}, (component: any, teardown: () => void) => {
      const contents = ast.updateWithBytecodeAndReturnCode(component.bytecode);
      writeFile(
        bytecodeFilename,
        contents,
        (err: any) => {
          teardown();
          next(err);
        },
      );
    });
  });
});
