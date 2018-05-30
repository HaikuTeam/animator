import {each} from 'async';
import {join} from 'path';
import {createComponent} from '@haiku/core/test/TestHelpers';
// @ts-ignore
import {readdir, writeFile} from 'haiku-fs-extra';
// @ts-ignore
import * as AST from 'haiku-serialization/src/bll/AST';

const goldensRoot = join(global.process.cwd(), 'test/goldens');
const ast = AST.upsert({uid: 'upgrader', file: true});

readdir(join(goldensRoot, 'bytecode'), (_: any, bytecodeFiles: string[]) => {
  each(bytecodeFiles, (filename, next) => {
    const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
    createComponent(require(bytecodeFilename), {}, (component: any, teardown: Function) => {
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
