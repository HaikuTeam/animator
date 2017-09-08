declare let REGEXPS: {
    type: string;
    re: RegExp;
}[];
declare function nth(n: any, type: any, arr: any): any;
declare function tokenize(source: any): any[];
declare function tokensToParams(tokens: any): any;
declare function signatureToParams(signature: any): any;
declare function functionToRFO(fn: any): {
    __function: {
        type: string;
        name: any;
        params: any;
        body: any;
    };
};
