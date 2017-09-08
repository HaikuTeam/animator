declare let index1: any;
declare let camelCaseRegex: RegExp;
declare let cssFunctionRegex: RegExp;
declare let cssEasings: {
    ease: any;
    easeIn: any;
    easeOut: any;
    easeInOut: any;
    stepStart: any;
    stepEnd: any;
    linear: any;
};
declare let camelCaseMatcher: (match: any, p1: any, p2: any) => any;
declare let toCamelCase: (value: any) => string;
declare let find: (nameOrCssFunction: any) => string[];
