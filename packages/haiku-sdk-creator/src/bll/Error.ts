import {shouldEmitErrors} from 'haiku-common/lib/environments';
// @ts-ignore
import {HOMEDIR_CRASH_REPORTS_PATH} from 'haiku-serialization/src/utils/HaikuHomeDir';
import {basename, join} from 'path';
import {crashReportFork} from '../dal/Carbonite';
import {MaybeAsync} from '../envoy';
import EnvoyHandler from '../envoy/EnvoyHandler';
import generateUUIDv4 from '../utils/generateUUIDv4';

export const ERROR_CHANNEL = 'error';

const UPLOAD_INTERVAL = 10;
const AWS_S3_HOST = 'http://support.haiku.ai.s3-us-west-2.amazonaws.com';

export interface CrashMetadata {
  zipPath: string;
  uniqueId: string;
  finalUrl: string;
}

export interface SentryExtraData {
  carbonite?: string;
  projectName?: string;
  projectPath?: string;
  organizationName?: string;
}

export interface SentryCallbackData {
  extra?: SentryExtraData;
  exception?: {
    values?: {
      value?: string;
    }[];
  };
  culprit?: string;
}

const getErrorMetadata = (data: SentryCallbackData) => ({
  message: (data.exception && data.exception[0] && data.exception[0].value) || 'Unknown',
  culprit: data.culprit,
});

// Returns true iff a culprit is from a local component file.
export const isUserlandCulprit = (culprit: string) => culprit && basename(culprit) === 'code.js';

export class SentryReporter {
  /**
   * An ErrorHandler instance that should be attached to a SentryReporter instance as soon as it's ready.
   * Because ErrorHandler instances will be resolved asynchronously in webviews, we typically won't have a handle
   * on the envoy handler at construction-time for this class.
   */
  envoy?: ErrorHandler;

  /**
   * Attaches carbonite data to an SentryExtraData payload and freezes the data.
   */
  freezeInCarbonite (data: SentryCallbackData, emit = true) {
    const {organizationName, projectName, projectPath} = data.extra;
    if (organizationName && projectName && projectPath) {
      const timestamp = generateUUIDv4();
      const zipName = `${projectName}-${timestamp}.zip`;
      const zipPath = join(HOMEDIR_CRASH_REPORTS_PATH, zipName);
      const uniqueId = `${organizationName}/${projectName}-${timestamp}`;
      const finalUrl = `${AWS_S3_HOST}/${organizationName}/${zipName}`;
      data.extra.carbonite = finalUrl;
      Promise.resolve(
        this.envoy.crashReport(
          emit,
          data,
          projectPath,
          zipName,
          zipPath,
          uniqueId,
          finalUrl,
        ),
      );

      return finalUrl;
    }
  }

  /**
   * Sentry callback for Node and JS clients. If an error handler is bound, attach a carbonite URL (if appropriate)
   * and emit.
   */
  callback (data: SentryCallbackData, emit = true): SentryCallbackData {
    if (!this.envoy) {
      return data;
    }

    if (!data.extra) {
      data.extra = {};
    }

    if (data.extra.projectPath && shouldEmitErrors()) {
      this.freezeInCarbonite(data, emit);
    } else {
      Promise.resolve(this.envoy.crashReport(emit, data));
    }

    return data;
  }
}

export class ErrorHandler extends EnvoyHandler {
  private lastUploadTime: number;

  get shouldSendCrashReport () {
    return !this.lastUploadTime || Date.now() >= UPLOAD_INTERVAL * 60000 + this.lastUploadTime;
  }

  clearLastUploadTime (): MaybeAsync<void> {
    this.lastUploadTime = undefined;
  }

  crashReport (
    emit: boolean,
    data: SentryCallbackData,
    projectPath?: string,
    zipName?: string,
    zipPath?: string,
    uniqueId?: string,
    finalUrl?: string,
  ): MaybeAsync<void> {
    if (projectPath && this.shouldSendCrashReport) {
      this.lastUploadTime = Date.now();

      crashReportFork(projectPath, zipName, zipPath, finalUrl);
      if (emit) {
        this.server.emit(ERROR_CHANNEL, {
          payload: {uniqueId, ...getErrorMetadata(data)},
          name: `${ERROR_CHANNEL}:error`,
        });
      }

      return;
    }

    if (emit) {
      this.server.emit(ERROR_CHANNEL, {
        payload: getErrorMetadata(data),
        name: `${ERROR_CHANNEL}:error`,
      });
    }
  }
}
