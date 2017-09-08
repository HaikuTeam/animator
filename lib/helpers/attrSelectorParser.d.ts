declare let ATTR_EXEC_RE: RegExp;
declare function attrSelectorParser(selector: any): {
    key: string;
    operator: string;
    value: string;
    insensitive: boolean;
};
