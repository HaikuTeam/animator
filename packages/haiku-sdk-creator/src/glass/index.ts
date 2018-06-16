import {MaybeAsync} from '../envoy';

export interface Glass {
  copy (): MaybeAsync<void>;
  cut (): MaybeAsync<void>;
}

export * from './GlassHandler';
