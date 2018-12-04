const prettier = require('prettier');
const BaseModel = require('./BaseModel');
const expressionToRO = require('@haiku/core/lib/reflection/expressionToRO').default;
const bytecodeObjectToAST = require('./../ast/bytecodeObjectToAST');
const normalizeBytecodeAST = require('./../ast/normalizeBytecodeAST');
const parseCode = require('./../ast/parseCode');
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments');

const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';
const HAIKU_VAR_ATTRIBUTE = 'haiku-var';

/**
 * @class AST
 * @description
 *  Holds a copy of a File's AST in memory and makes manipulation calls
 *  more convenient. Includes static helper methods for AST manpulation.
 */
class AST extends BaseModel {
  constructor (props, opts) {
    super(props, opts);

    // To contain the actual AST object from our associated file
    this.obj = {};
  }

  updateWithBytecode (bytecode, previousSourceCodeString) {
    // Grab imports before we strip the __reference property
    const imports = AST.findImportsFromTemplate(this.file, bytecode.template);

    const ro = AST.normalizeBytecode(bytecode);

    const {
      frontMatterNodes,
      backMatterNodes,
    } = grabExtraMatterFromSourceCode(previousSourceCodeString);

    const ast = bytecodeObjectToAST(
      ro,
      imports,
      frontMatterNodes,
      backMatterNodes,
    );

    normalizeBytecodeAST(ast);

    // Merge instead of replacing wholesale in case we have any pointers
    for (const k1 in this.obj) {
      delete this.obj[k1];
    }
    for (const k2 in ast) {
      this.obj[k2] = ast[k2];
    }

    return this.obj;
  }

  updateWithBytecodeAndReturnCode (bytecode, previousSourceCodeString) {
    this.updateWithBytecode(bytecode, previousSourceCodeString);
    return this.toCode();
  }

  toCode () {
    // Prettier doesn't expose a public API that would allow us to "cheat" elegantly, but…
    return prettier.format(
      // …as long as we pass in some nonempty string…
      '()=>{}',
      {
        // …we can bypass an extra AST parse step from generated code and return our AST direcetly.
        parser: () => this.obj,
      },
    );
  }
}

AST.DEFAULT_OPTIONS = {
  required: {
    file: true,
  },
};

BaseModel.extend(AST);

const grabExtraMatterFromSourceCode = (code) => {
  const out = {
    frontMatterNodes: [],
    backMatterNodes: [],
  };

  if (
    !experimentIsEnabled(Experiment.PreserveFrontMatterInCode) ||
    !code
  ) {
    return out;
  }

  try {
    const ast = parseCode(code);

    if (ast instanceof Error) {
      return out;
    }

    if (!ast || !ast.program || !ast.program.body) {
      return out;
    }

    let nodesCollection = out.frontMatterNodes;

    ast.program.body.forEach((node) => {
      if (isAutoGenImportNode(node)) {
        return;
      }

      if (isModuleExportsNode(node)) {
        nodesCollection = out.backMatterNodes;
        return;
      }

      nodesCollection.push(node);
    });

    return out;
  } catch (exception) {
    console.warn('[AST]', exception);
    return out;
  }
};

const isAutoGenImportNode = (node) => {
  // Assumes the form `var Foo = require('bar')`
  return (
    node.type === 'VariableDeclaration' &&
    node.declarations &&
    node.declarations[0] &&
    node.declarations[0].type === 'VariableDeclarator' &&
    node.declarations[0].init.type === 'CallExpression' &&
    node.declarations[0].init.callee.type === 'Identifier' &&
    node.declarations[0].init.callee.name === 'require' &&
    node.declarations[0].init.arguments &&
    doesRequireCalleeArgIndicateAutoGenImport(
      node.declarations[0].init.arguments[0],
    )
  );
};

const doesRequireCalleeArgIndicateAutoGenImport = (node) => {
  return (
    node &&
    typeof node.value === 'string' &&
    isImportSourceViaAutoGen(node.value)
  );
};

const isImportSourceViaAutoGen = (source) => {
  return (
    source === '@haiku/core' || // var Haiku = require('@haiku/core'); the core lib
    source.match(/^@haiku\/core\/components/) || // var Text = require('@haiku/core/components/controls/Text');
    source.match(/\/code\.js$/) // var  Foo = require("../foo/code.js"); subcomponents
  );
};

const isModuleExportsNode = (node) => {
  // Assumes the form `module.exports = {...}`
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'MemberExpression' &&
    node.expression.left.object.name === 'module' &&
    node.expression.left.property.name === 'exports' &&
    node.expression.right.type === 'ObjectExpression'
  );
};

AST.normalizeBytecode = (bytecode) => {
  const safe = AST.safeBytecode(bytecode);

  const decycled = Bytecode.decycle(safe, {doCleanMana: false});

  // Strip off `__max` and other cruft editor/core may have added
  Bytecode.cleanBytecode(decycled);
  Template.cleanTemplate(decycled.template);

  return expressionToRO(decycled);
};

AST.findImportsFromTemplate = (hostfile, template) => {
  // We'll build a mapping from source path to identifier name
  const imports = {};

  // This assumes that the module paths have been normalized and relativized
  Template.visitWithoutDescendingIntoSubcomponents(template, (node, parent, index, depth, address) => {
    if (node && node.elementName && typeof node.elementName === 'object') {
      let source;
      let identifier;

      // If we're loading from in-memory then this should be present
      if (node.elementName.__reference) {
        const reference = ModuleWrapper.parseReference(node.elementName.__reference);
        if (reference) {
          source = reference.source;
          identifier = reference.identifier;
        }
      } else {
        // But if we just reloaded from disk via require, it'll be the bytecode object
        // and we have to do a bit of hackery in case the element was a primitive
        source = node.attributes && node.attributes[HAIKU_SOURCE_ATTRIBUTE];
        identifier = node.attributes && node.attributes[HAIKU_VAR_ATTRIBUTE];
      }

      if (source && identifier) {
        // In case these weren't set (see above), set them so downstream codegen works :/
        node.elementName.__reference = ModuleWrapper.buildReference(
          ModuleWrapper.REF_TYPES.COMPONENT, // type
          Template.normalizePath(`./${hostfile.relpath}`), // host
          Template.normalizePathOfPossiblyExternalModule(source),
          identifier,
        );

        // While the source string we store as an attribute is always with respect to the project
        // folder, the actual import path we need to write to the file is relative to this module
        const importSourcePath = hostfile.getImportPathTo(source);

        imports[importSourcePath] = identifier;
      }
    }
  });

  return imports;
};

AST.safeBytecode = (bytecode) => {
  const safe = {};
  // We're dealing with a chunk of bytecode that has been rendered, so we need to fix
  // the template object which has been mutated, and return it to its serializable form
  for (const key in bytecode) {
    if (key === 'template') {
      safe[key] = Template.manaWithOnlyStandardProps(bytecode[key], true, (__reference) => {
        const ref = ModuleWrapper.parseReference(__reference);

        if (ref && ref.identifier) {
          return ref.identifier;
        }

        return __reference;
      });
    } else {
      safe[key] = bytecode[key];
    }
  }
  return safe;
};

AST.parseFile = (folder, relpath, contents, cb) => {
  const ast = parseCode(contents);
  if (ast instanceof Error) {
    return cb(ast);
  }

  return cb(null, ast);
};

module.exports = AST;

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode');
const ModuleWrapper = require('./ModuleWrapper');
const Template = require('./Template');
