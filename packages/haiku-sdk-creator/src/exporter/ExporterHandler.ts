import {ExporterRequest} from '.';
import {EnvoyEvent, MaybeAsync} from '../envoy';
import EnvoyHandler from '../envoy/EnvoyHandler';

export const EXPORTER_CHANNEL = 'exporter';

export class ExporterHandler extends EnvoyHandler {
  save (request: ExporterRequest): MaybeAsync<void> {
    this.trackProgress(request);
    this.server.emit(EXPORTER_CHANNEL, {
      payload: request,
      name: `${EXPORTER_CHANNEL}:save`,
    } as EnvoyEvent);
  }

  trackProgress (request: ExporterRequest, progress = 0): MaybeAsync<void> {
    request.progress = progress;
    this.server.emit(EXPORTER_CHANNEL, {
      payload: request,
      name: `${EXPORTER_CHANNEL}:progress`,
    });
  }

  saved (request: ExporterRequest): MaybeAsync<void> {
    this.trackProgress(request, 1);
  }
}
