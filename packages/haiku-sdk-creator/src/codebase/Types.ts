
export abstract class CodebaseFlavor {
  constructor (public directory: string) {}
  // Tests whether the provided directory seems to
  // contain a project of this Flavor
  abstract testCompatibility (): boolean;

  // set up haiku hooks into this codebase,
  // e.g. a .haiku folder and a haiku src dir
  abstract initCodebase (): void;

  // Builds this project as a library, if possible
  abstract buildLibrary (): void;

  // Finds all components in the
  abstract findComponents (): Promise<ForeignComponent[]>;

  abstract writeHaikuToCodebase (): void;
}

export interface ForeignComponent {
  contents: string;
  path: string;
  thumbnail: ArrayBuffer;
  moduleReference: any;
}

const noop = () => {};
