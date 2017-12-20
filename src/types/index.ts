export type Maybe<T> = T|null|undefined;

// TODO(EcvdJ3PZ): Actually provide Haiku bytecode as a type.
export type HaikuBytecode = any;

export type TemplateElement<T> = {
  elementName: string;
  attributes: TemplateElementAttributes;
  children: [T];
};

export type TemplateElementAttributes = {
  [key: string]: any;
};
