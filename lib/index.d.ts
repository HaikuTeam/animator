export declare namespace client {
    function verboselyLog(message: string, ...args: any[]): void;
    function error(err: any): void;
    class npm {
        static readPackageJson(path?: string): any;
        static writePackageJson(jsonObject: any, path?: string): void;
    }
    class git {
        static ensureRemoteIsInitialized(remoteName: string, remoteUrl: string, cb: Function): void;
        static forciblyCloneSubrepo(remote: string, path: string, cb: Function): void;
        static cloneRepo(remote: string, path: string, cb: (error?: any) => any): void;
    }
    interface ClientConfig {
        verbose?: boolean;
    }
    function setConfig(newVals: ClientConfig): void;
    class config {
        static getAuthToken(): string;
        static getUserId(): string;
        static isAuthenticated(): boolean;
        static setAuthToken(newToken: string): void;
        static setUserId(newUserId: string): void;
    }
}
