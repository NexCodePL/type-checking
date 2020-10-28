export type AcceptableTypes = string | number | boolean | Date;

type ArrayElementType<T> = T extends (infer ItemType)[] ? ItemType : never;

export type Base<T> = {
    [P in keyof T]:
        | AcceptableTypes
        | Base<T[P]>
        | Array<string>
        | Array<number>
        | Array<boolean>
        | Array<Date>
        | Array<Base<ArrayElementType<T[P]>>>;
};

interface PropValidateDefinitionRequired<TypeName, Type = never> {
    optional?: false;
    type: TypeName;
    in?: Type[];
}

interface PropValidateDefinition<TypeName, Type = never> {
    optional: true;
    type: TypeName;
    in?: Type[];
}

export type ObjectValidateDefinition<T extends Base<T>> = {
    [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
        ? T[P] extends string
            ? PropValidateDefinitionRequired<"string", T[P]>
            : T[P] extends number
            ? PropValidateDefinitionRequired<"number", T[P]>
            : T[P] extends boolean
            ? PropValidateDefinitionRequired<"boolean">
            : T[P] extends Date
            ? PropValidateDefinitionRequired<"Date">
            : T[P] extends Array<string>
            ? PropValidateDefinitionRequired<"stringArray">
            : T[P] extends number[]
            ? PropValidateDefinitionRequired<"numberArray">
            : T[P] extends boolean[]
            ? PropValidateDefinitionRequired<"booleanArray">
            : T[P] extends Date[]
            ? PropValidateDefinitionRequired<"DateArray">
            : T[P] extends Array<Base<ArrayElementType<T[P]>>>
            ? ArrayElementType<T[P]> extends Base<ArrayElementType<T[P]>>
                ? {
                      optional?: false;
                      type: "objectArray";
                      validate: ObjectValidateDefinition<ArrayElementType<T[P]>>;
                      in?: never[];
                  }
                : never
            : T[P] extends Base<T[P]>
            ? { optional?: false; type: "object"; validate: ObjectValidateDefinition<T[P]>; in?: never[] }
            : never
        : T[P] extends string
        ? PropValidateDefinition<"string", T[P]>
        : T[P] extends number
        ? PropValidateDefinition<"number", T[P]>
        : T[P] extends boolean
        ? PropValidateDefinition<"boolean">
        : T[P] extends Date
        ? PropValidateDefinition<"Date">
        : T[P] extends string[]
        ? PropValidateDefinition<"stringArray">
        : T[P] extends number[]
        ? PropValidateDefinition<"numberArray">
        : T[P] extends boolean[]
        ? PropValidateDefinition<"booleanArray">
        : T[P] extends Date[]
        ? PropValidateDefinition<"DateArray">
        : T[P] extends Array<Base<ArrayElementType<T[P]>>>
        ? ArrayElementType<T[P]> extends Base<ArrayElementType<T[P]>>
            ? {
                  optional: true;
                  type: "objectArray";
                  validate: ObjectValidateDefinition<ArrayElementType<T[P]>>;
                  in?: never[];
              }
            : never
        : T[P] extends Base<T[P]>
        ? { optional: true; type: "object"; validate: ObjectValidateDefinition<T[P]>; in?: never[] }
        : never;
};

export interface ValidateObjectDefinitionObjectType {
    optional: boolean;
    type: "object" | "objectArray";
    validate: ObjectValidateDefinition<any>;
}

export interface ValidetObjectResponse {
    isValid: boolean;
    errors: ValidateObjectError[];
}

export interface ValidateObjectError {
    field: string;
    errorCode: string;
    errorMessage: string;
}

export type BasicType = "string" | "number" | "boolean" | "Date";
export type ArrayBasicType = "stringArray" | "numberArray" | "booleanArray" | "DateArray";
