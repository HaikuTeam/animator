import * as fs from 'fs';
import * as path from 'path';

// Returns a tree of files matching the provided regex
export class FileSystem {
  static walkDirectoryAndMatch (dirPath: string, fileMatchRegex: RegExp): FolderNode {
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

export class FolderNode {
  files: string[];
  folders: FolderNode[];
  path: string;

  isEmpty (): boolean {
    return (!this.files || !this.files.length) && (!this.folders || !this.folders.length);
  }
}
