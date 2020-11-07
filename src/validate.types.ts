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

type IsOptional = { optional: true };
type NotOptional = { optional?: false };

export type PropValidateCustomBase<TypeName, Prop> = {
    type: TypeName;
    customValidate: (prop: Prop, fieldName: string) => ValidetObjectResponse;
    in?: never[];
};

export type PropValidateCustom<TypeName, Prop, TOptional extends boolean> = TOptional extends true
    ? PropValidateCustomBase<TypeName, Prop> & IsOptional
    : PropValidateCustomBase<TypeName, Prop> & NotOptional;

export type PropValidateObjectBase<TypeName, Prop> = {
    type: TypeName;
    validate: ObjectValidateDefinition<Prop>;
    in?: never[];
};

export type PropValidateObject<TypeName, Prop, TOptional extends boolean> = TOptional extends true
    ? PropValidateObjectBase<TypeName, Prop> & IsOptional
    : PropValidateObjectBase<TypeName, Prop> & NotOptional;

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
                ?
                      | PropValidateObject<"objectArray", ArrayElementType<T[P]>, false>
                      | PropValidateCustom<"objectArrayCustom", T[P], false>
                : never
            : T[P] extends Base<T[P]>
            ? PropValidateObject<"object", T[P], false> | PropValidateCustom<"objectCustom", T[P], false>
            : never
        : T[P] extends string | undefined
        ? PropValidateDefinition<"string", T[P]>
        : T[P] extends number | undefined
        ? PropValidateDefinition<"number", T[P]>
        : T[P] extends boolean | undefined
        ? PropValidateDefinition<"boolean">
        : T[P] extends Date | undefined
        ? PropValidateDefinition<"Date">
        : T[P] extends string[] | undefined
        ? PropValidateDefinition<"stringArray">
        : T[P] extends number[] | undefined
        ? PropValidateDefinition<"numberArray">
        : T[P] extends boolean[] | undefined
        ? PropValidateDefinition<"booleanArray">
        : T[P] extends Date[] | undefined
        ? PropValidateDefinition<"DateArray">
        : T[P] extends Array<Base<ArrayElementType<T[P]>>> | undefined
        ? ArrayElementType<T[P]> extends Base<ArrayElementType<T[P]>>
            ?
                  | PropValidateObject<"objectArray", ArrayElementType<T[P]>, true>
                  | PropValidateCustom<"objectArrayCustom", T[P], true>
            : never
        : T[P] extends Base<T[P]> | undefined
        ? PropValidateObject<"object", T[P], true> | PropValidateCustom<"objectCustom", T[P], false>
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
