export declare type MaybeAsync<T> = T | Promise<T>;
export declare function SurrogateHandler(className: string): (target: any) => void;
export declare function SurrogateClient(className: string): (target: any) => void;
export declare function requestor(prototype: Function, name: string, descriptor: PropertyDescriptor): void;
