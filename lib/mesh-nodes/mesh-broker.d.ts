export interface MeshHostConfig {
    port: string;
    path: string;
    host: string;
}
export default class MeshHost {
    private config;
    start(config: MeshHostConfig): void;
    restart(config?: any): void;
    stop(): void;
}
