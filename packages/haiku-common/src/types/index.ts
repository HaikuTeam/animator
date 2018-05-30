export type Maybe<T> = T|null|undefined;

export type ContextualSize = {
  x: number;
  y: number;
  z: number;
};

export type CubicCurve = {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type TemplateElement<T> = {
  elementName: string;
  attributes: TemplateElementAttributes;
  children: [T];
};

export type TemplateElementAttributes = {
  [key: string]: any;
};

export type PlumbingProject = {
  projectPath: string;
  projectName: string;
  projectExistsLocally: boolean;
  projectsHome: string;
  repositoryUrl: string;
  forkComplete: boolean;
  isPublic:boolean;
};
