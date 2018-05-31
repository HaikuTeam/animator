import * as ts from 'typescript';

/* Inspired by  https://gist.github.com/teppeis/6e0f2d823a94de4ae442 and
 * https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API */
export default (contents, libSource, compilerOptions) => {
  // Generated outputs
  const outputs = [];

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: any = {
    getSourceFile (filename, languageVersion) {
      if (filename === 'file.ts') {
        return ts.createSourceFile(filename, contents, compilerOptions.target, false);
      }
      if (filename === 'lib.d.ts') {
        return ts.createSourceFile(filename, libSource, compilerOptions.target, false);
      }
      console.log(ts.sys.getCurrentDirectory());
      const sourceText = ts.sys.readFile(filename);
      return sourceText !== undefined ? ts.createSourceFile(filename, sourceText, languageVersion) : undefined;
    },
    writeFile (name, text, writeByteOrderMark) {
      outputs.push({name, text, writeByteOrderMark});
    },
    getDefaultLibFileName () { return 'lib.d.ts'; },
    useCaseSensitiveFileNames () { return false; },
    getCanonicalFileName (filename) { return filename; },
    getNewLine () { return '\n'; },
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
  };

  // Create a program from inputs
  const program = ts.createProgram(['file.ts'], compilerOptions, compilerHost);

  const emitResult = program.emit();

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  const fileErrors = allDiagnostics.filter((diagnostic) => diagnostic.file);// && diagnostic.code == 2322)
    
  fileErrors.forEach((fileError) => {
    const {line, character} = fileError.file.getLineAndCharacterOfPosition(fileError.start);
    const message = ts.flattenDiagnosticMessageText(fileError.messageText, '\n');
    console.log(`[${fileError.code}] ${fileError.file.fileName} (${line + 1},${character + 1}): ${message}`);
  });
    
  const TYPE_ERRO_CODE = 2322;
  const typeErrors = allDiagnostics.filter((diagnostic) => diagnostic.code === TYPE_ERRO_CODE);

  return typeErrors;
};
