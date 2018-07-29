import * as fs from 'fs';
import * as path from 'path';
import {FileSystem, FolderNode} from '../../utils/FileSystem';
import {CodebaseFlavor, ForeignComponent} from '../Types';

export class VueCliFlavor extends CodebaseFlavor {
  constructor (directory: string) {
    super(directory);
  }

  private getProjectSrcDir () {
    // assume for all vue-cli projects that src is at @/src
    return path.join(this.directory, 'src');
  }

  private getHaikuSrcDir () {
    // assume for all vue-cli projects that src is at @/src
    return path.join(this.getProjectSrcDir(), 'haiku/');
  }

  private getPackageJson (): any {
    let ret = {};
    try {
      ret = JSON.parse(fs.readFileSync(path.join(this.directory, 'package.json'), 'utf-8'));
    } catch (e) {
      ret = {};
    }
    return ret;
  }

  initCodebase () {
    // TODO:  add .npmrc
    // TODO:  add .haiku folder & relevant info
    // TODO:  inject relevant info into package.json, incl. deps

    // TODO:  generate index of supposed components
    // May need to perform static analysis on foreign codebase?
    //   get:  name, props,
    // Need to generate an index of files/components, then use that to code-gen
    // an index file for the vue-cli build, a la lib-index.ts in:
    // > vue-cli-service build --target lib --name myLib src/lib-index.ts

    // create the src/haiku folder
    const src = this.getProjectSrcDir();
    const haikuSrc = path.join(src, 'haiku');
    try {
      fs.mkdirSync(haikuSrc);
    } catch (e) {
      // folder already exists (which is fine; we can skip)
      // OR some deeper fs error (e.g. folder moved or insufficient permissions)
      // Either way, suppressing this error for now.
    }

    const dotHaiku = path.join(this.directory, '.haiku');
    try {
      fs.mkdirSync(dotHaiku);
    } catch (e) {
      // folder already exists (which is fine; we can skip)
    }

  }

  async findComponents (): Promise<ForeignComponent []> {
    // TODO:  loading = true ; patch into UI

    this.generateIndexFile();
    await this.buildLibrary();
    // TODO:  loading = false ; patch into UI

    // load json manifest from generated library code
    return [];
  }

  // Traverse fs, list all files into an index file
  // Note that finding actual components, e.g. multiple per file or
  // ignoring files w/o components, will have to happen by traversing
  // the Module dynamically, since static analysis of an arbitrary codebase will be Hard.
  generateIndexFile () {
    const MATCHING_FILES = /(\.vue|\.js|\.ts)$/;
    const fileTree = FileSystem.walkDirectoryAndMatch(this.getProjectSrcDir(), MATCHING_FILES);
    const fileContents = `${this.evalIndexImportsTemplate(fileTree)}

    export default {
      ${this.evalIndexReturnObjectTemplate(fileTree)}
    }
    `;

    // TODO:  write fileContents to @/.haiku/lib.index.js
  }

  evalIndexImportsTemplate (fileTree: FolderNode) {
    // TODO:
    // import Color from './views/Color.vue';
  }

  evalIndexReturnObjectTemplate (fileTree: FolderNode) {
    // TODO:
    // export default {
    //   Color
    // };
  }

  buildLibrary () {
    throw new Error('not implemented');
  }

  testCompatibility () {
    const packageJson = this.getPackageJson();
    const conditions = [
      // has @vue/cli-service as a devDependency:
      () => packageJson.devDependencies && packageJson.devDependencies['@vue/cli-service'],
    ];

    // If one or more conditions are met, it's a match
    return conditions.reduce((accum, cur) => {
      let current = false;
      // Need to wrap in try/catch to enable brevity in `conditions`
      try {
        current = cur();
      } catch (e) {
        current = false;
      }
      return accum || current;
    }, false);
  }

  writeHaikuToCodebase (): void {
    const haikuSrc = this.getHaikuSrcDir();
    // TODO:  - find all Haiku Components in the current project
    //          that should be written to the codebase
    //        - generate a Component.js (or .ts) in the src/haiku folder
    throw new Error('not implemented');
  }
}
