import {Exporter, ExporterRequest} from '.';
import {EnvoyEvent, MaybeAsync} from '../envoy';
import EnvoyServer from '../envoy/EnvoyServer';

export const EXPORTER_CHANNEL = 'exporter';

export class ExporterHandler implements Exporter {
  constructor (private readonly server: EnvoyServer) {}

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
