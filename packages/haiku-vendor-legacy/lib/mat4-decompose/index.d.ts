export declare const round: (value: number) => number;
export declare function roundVector<T extends number[]>(vector: T): T;
export declare type ThreeTuple = [number, number, number];
export declare type FourTuple = [number, number, number, number];
export interface DecomposedMat4 {
    translation: ThreeTuple;
    scale: ThreeTuple;
    shear: ThreeTuple;
    rotation: ThreeTuple;
}
export default function decomposeMat4(matrix: any): DecomposedMat4;
