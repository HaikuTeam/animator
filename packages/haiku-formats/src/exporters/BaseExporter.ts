import HaikuDOMAdapter from '@haiku/core/lib/adapters/dom/HaikuDOMAdapter';
import {
  BytecodeTimelineProperties,
  HaikuBytecode,
  ThreeDimensionalLayoutProperty,
} from '@haiku/core/lib/api';
import {readPackageJson} from '@haiku/sdk-client/lib/ProjectDefinitions';
import * as path from 'path';

export default class BaseExporter {
  // StandaloneBundlerExporter, EmbedBundlerExporter and BundledZipExporter
  // uses project information instead component information
  private projectFolder: string;
  private projectName: string;
  private projectOrganizationName: string;

  constructor (protected readonly bytecode: HaikuBytecode, protected readonly componentFolder: string) {
    this.projectFolder = path.resolve(this.componentFolder, '..', '..');
    const packageJson = readPackageJson(this.projectFolder);
    this.projectOrganizationName = packageJson.haiku.organization;
    this.projectName = packageJson.haiku.project;
  }

  // Information from package.json project root folder
  protected getProjectFolder (): string {
    return this.projectFolder;
  }

  // Information from package.json project root folder
  protected getProjectName (): string {
    return this.projectName;
  }

  // Information from package.json project root folder
  protected getProjectOrganizationName (): string {
    return this.projectOrganizationName;
  }

  /**
   * Internal method for visiting every timeline and applying a callback to it.
   */
  protected visitAllTimelines (callback: (timeline: BytecodeTimelineProperties) => void) {
    for (const timelineId in this.bytecode.timelines) {
      for (const haikuId in this.bytecode.timelines[timelineId]) {
        if (/^__/.test(haikuId)) {
          continue;
        }
        callback(this.bytecode.timelines[timelineId][haikuId]);
      }
    }
  }

  /**
   * Internal method for visiting every timeline property and applying a callback to it.
   */
  protected visitAllTimelineProperties (callback: (timeline: BytecodeTimelineProperties, property: string) => void) {
    this.visitAllTimelines((timeline) => {
      for (const property in timeline) {
        callback(timeline, property);
      }
    });
  }

  protected getComponentSize (): ThreeDimensionalLayoutProperty {
    const factory = HaikuDOMAdapter(this.bytecode);
    const component = factory(
      null,
      {
        mixpanel: false,
        contextMenu: 'disabled',
        hotEditingMode: true,
        autoplay: false,
      },
    );

    const size = {...component.size};

    // We only want to run migrations and perform auto-sizing. The component can go out of scope now.
    component.context.destroy();

    return size;
  }
}
