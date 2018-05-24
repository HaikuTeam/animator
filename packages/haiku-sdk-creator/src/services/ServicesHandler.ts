import * as Figma from 'haiku-serialization/src/bll/Figma';
import EnvoyServer from '../envoy/EnvoyServer';
import {ImportSpec, MaybeAsync, TokenExchange} from '.';

export interface Services {
  figmaImportSVG(importSpec: ImportSpec, authToken: string): MaybeAsync<void>;

  figmaGetAccessToken(tokenExchange: TokenExchange): MaybeAsync<object>;
}

export class ServicesHandler implements Services {
  private server: EnvoyServer;

  constructor(server: EnvoyServer) {
    this.server = server;
  }

  figmaImportSVG(importSpec, authToken) {
    const figma = new Figma({token: authToken});
    return figma.importSVG(importSpec);
  }

  figmaGetAccessToken(tokenExchange) {
    return Figma.getAccessToken(tokenExchange);
  }
}
