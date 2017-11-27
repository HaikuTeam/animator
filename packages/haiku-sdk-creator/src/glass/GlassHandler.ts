import {Glass} from '.';
import {EnvoyEvent, MaybeAsync} from '../envoy';
import EnvoyServer from '../envoy/EnvoyServer';

export const GLASS_CHANNEL = 'glass';

export class GlassHandler implements Glass {
  constructor(private readonly server: EnvoyServer) {}

  cut(): MaybeAsync<void> {
    this.server.emit(GLASS_CHANNEL, <EnvoyEvent> {
      payload: {},
      name: 'cut',
    });
  }

  copy(): MaybeAsync<void> {
    this.server.emit(GLASS_CHANNEL, <EnvoyEvent> {
      payload: {},
      name: 'copy',
    });
  }
}
