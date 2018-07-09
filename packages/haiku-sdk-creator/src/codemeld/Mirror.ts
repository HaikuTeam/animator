import * as fs from 'fs';
import * as path from 'path';

export interface Override {
  filePath: string;
  perform: () => void;
  teardown: () => void;
}

export class TransformOverride implements Override {
  constructor (
    public filePath: string,
    public filterFunction: (input: string) => string,
  ) {
  }

  // side-effectfully perform the override, writing the target file to disk
  perform () {

  }

  teardown () {
        // TODO: clean up files
  }
}

export class OverwriteOverride implements Override {
  constructor (
    public filePath: string,
    public overwriteString: string,
  ) {
  }

  // side-effectfully perform the override, writing the target file to disk
  perform () {

  }

  teardown () {
    // TODO: clean up files
  }
}

class FolderNode {
  files: string[];
  folders: FolderNode[];
  path: string;

  isEmpty (): boolean {
    return (!this.files || !this.files.length) && (!this.folders || !this.folders.length);
  }
}

// Symlinks specified files from sourceGlob into mirrorDir
export default class Mirror {

  // mounted to a source folder
  constructor (projectRoot: string, mirrorDir: string, fileMatchRegex: RegExp, overrides: Override[]) {

    const allFiles = this.walkDirectoryAndMatch(projectRoot, /.*/);
    // TODO: symlink all files, creating directories as needed (i.e. rather than symlinking directories)
    // TODO: while symlinking, check Overrides and replace or filter as needed
    // TODO: set up watching, updating symlinks when source files change
    //       NOTE we can try 1st whole-sale resetting everything from scratch then iterate to be more surgical

    // TODO: author Overrides (passed in from outside, probably)

    const matchedFiles = this.walkDirectoryAndMatch(projectRoot, fileMatchRegex);
    // TODO:  generate a custom 'main.js' (or .ts) which exposes these through individual routes
    // TODO:  pass this tree of files to the UI for displaying
    if (matchedFiles.isEmpty()) {
      console.log('No files found matching ' + fileMatchRegex.toString());
    }
    console.log(JSON.stringify(matchedFiles));
  }

  // Returns a tree of files matching the provided regex
  private walkDirectoryAndMatch (dirPath: string, fileMatchRegex: RegExp): FolderNode {
    // return tree of matched files & folders, as FolderNodes
    const folderNode = new FolderNode();
    folderNode.path = dirPath;
    const files: string[] = fs.readdirSync(dirPath);
    const fileMatches: string[] = [];
    const folders: FolderNode[] = [];
    for (const i in files) {
      const name = path.join(dirPath, files[i]);
      if (fs.statSync(name).isDirectory()) {
        const matchedNode = this.walkDirectoryAndMatch(name, fileMatchRegex);
        if (!matchedNode.isEmpty()) {
          folders.push(matchedNode);
        }
      } else if (fileMatchRegex.test(name)) {
        fileMatches.push(name);
      }
    }
    folderNode.files = fileMatches;
    folderNode.folders = folders;
    return folderNode;
  }
}
