declare let getErrors: (shape: any) => any;
declare let getRules: (shape: any) => {
    match: string[];
    prop: string;
    required: boolean;
    type: string;
}[];
declare let valid: (shape: any) => {
    errors: any;
    valid: boolean;
};
