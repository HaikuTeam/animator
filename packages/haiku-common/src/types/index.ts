export type Maybe<T> = T|null|undefined;

export interface CubicCurve {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}

export interface TemplateElement<T> {
  elementName: string;
  attributes: TemplateElementAttributes;
  children: [T];
}

export interface TemplateElementAttributes {
  [key: string]: any;
}

export interface PlumbingProject {
  projectPath: string;
  projectName: string;
  projectExistsLocally: boolean;
  projectsHome: string;
  repositoryUrl: string;
  forkComplete: boolean;
  isPublic: boolean;
}
