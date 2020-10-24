interface Test {
    b: string;
    a?: number;
    // c?: {
    //     t: [number | Date];
    //     e: Array<{ t: string }>;
    // };
}

type AcceptableTypes = string | number | boolean | Date;

type Base<T> = {
    // [P in keyof T]: AcceptableTypes | Base<any> | Array<AcceptableTypes> | Array<Base<any>>;
    [P in keyof T]: AcceptableTypes;
};

const test: Test = {
    b: "1",
};

function validate<T extends Base<T>>(object: T) {
    console.log(object);
    const keys = Object.keys(object);
    console.log(keys);
}

validate(test);
