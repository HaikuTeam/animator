const BaseModel = require('./BaseModel');

/**
 * @class PseudoFile
 */
class PseudoFile extends BaseModel {}

PseudoFile.DEFAULT_OPTIONS = {
  required: {
    relpath: true,
  },
};

BaseModel.extend(PseudoFile);

module.exports = PseudoFile;
