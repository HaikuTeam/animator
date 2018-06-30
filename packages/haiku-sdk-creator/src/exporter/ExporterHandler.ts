import {Exporter, ExporterRequest} from '.';
import {EnvoyEvent, MaybeAsync} from '../envoy';
import EnvoyHandler from '../envoy/EnvoyHandler';

export const EXPORTER_CHANNEL = 'exporter';

export class ExporterHandler extends EnvoyHandler implements Exporter {
  save (request: ExporterRequest): MaybeAsync<void> {
    this.server.emit(EXPORTER_CHANNEL, {
      payload: request,
      name: `${EXPORTER_CHANNEL}:save`,
    } as EnvoyEvent);
  }

  saved (request: ExporterRequest): MaybeAsync<void> {
    this.server.emit(EXPORTER_CHANNEL, {
      payload: request,
      name: `${EXPORTER_CHANNEL}:saved`,
    } as EnvoyEvent);
  }
}
