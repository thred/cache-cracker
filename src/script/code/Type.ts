import {Procedure} from "./Procedure";
import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

import * as Globals from "./Globals";
import * as Utils from "./Utils";

import {TypeParser} from "./parser/TypeParser";

export type TypeName = "Any" | "Bool" | "List" | "Map" | "Procedure" | "Quantity" | "Text" | "Type" | "Unit" | "Void";

export abstract class Type implements Utils.Scripted {

    static of(value: any): Type {
        if ((value === undefined) || (value === null)) {
            return Types.VOID;
        }

        if (isBool(value)) {
            return Types.BOOL;
        }

        if (isQuantity(value)) {
            return Types.QUANTITY;
        }

        if (isText(value)) {
            return Types.TEXT;
        }

        if (isType(value)) {
            return Types.TYPE;
        }

        if (isUnit(value)) {
            return Types.UNIT;
        }

        if (isList(value)) {
            return Types.LIST;
        }

        if (isMap(value)) {
            return Types.MAP;
        }

        if (isProcedure(value)) {
            return new DistinctType("Procedure", (value as Procedure).resultType);
        }

        throw new Error(`Failed to detect type: ${value} (${typeof value})`);
    }

    static parse(type: Type | string): Type {
        Utils.requiredNotNull(type, "Type is null");

        if (type instanceof Type) {
            return type as Type;
        }

        if (typeof type === "string") {
            return new TypeParser(type as string).parse();
        }

        throw new Error(`You may want to use Type.of for type of: ${type}`);
    }

    static or(types: (Type | string)[]): Type {
        Utils.requiredNotNull(types, "Types is null");

        if (types.length === 0) {
            throw new Error("Types is empty");
        }

        return new OrType(types.map((type) => Type.parse(type)));
    }

    constructor() {
    }

    acceptsValue(value: any): boolean {
        if ((value === undefined) || (value === null)) {
            return true;
        }

        return this.accepts(Type.of(value));
    }

    abstract accepts(type: Type): boolean;

    abstract matches(type: Type): boolean;

    abstract isAny(): boolean;

    abstract isVoid(): boolean;

    toDistinctType(): DistinctType {
        throw new Error(`Type is not distinct: ${this.toScript(Globals.DEFAULT_ACCENT)}`);
    }

    abstract toScript(accent: string): string;

    abstract toString(): string;
}

export class AnyType extends Type {

    constructor() {
        super();
    }

    accepts(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        return true;
    }

    matches(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        return type.isAny();
    }

    isAny(): boolean {
        return true;
    }

    isVoid(): boolean {
        return false;
    }

    toScript(accent: string): string {
        return "?";
    }

    toString(): string {
        return `AnyType()`;
    }

}

export class DistinctType extends Type {

    constructor(private _name: TypeName, private _param?: Type) {
        super();

        Utils.requiredNotNull(_name, "Types is null");
    }

    get name() {
        return this._name;
    }

    get param() {
        return this._param;
    }

    accepts(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        if (type.isAny()) {
            return false;
        }

        if (type.isVoid()) {
            return true;
        }

        if (type instanceof DistinctType) {
            let distinctType = type as DistinctType;

            if (this._name !== distinctType._name) {
                return false;
            }

            if (!this._param) {
                return true;
            }

            return this._param.accepts(distinctType._param);
        }

        if (type instanceof OrType) {
            let orType = type as OrType;

            return orType.types.every((currentType) => this.accepts(currentType));
        }

        throw new Error(`Unsupported type: ${type} (${typeof type})`);
    }

    matches(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        if (type.isAny()) {
            return false;
        }

        if (type.isVoid()) {
            return false;
        }

        if (type instanceof DistinctType) {
            let distinctType = type as DistinctType;

            if (this._name !== distinctType._name) {
                return false;
            }

            if (!this._param) {
                return !distinctType._param;
            }

            return this._param.matches(distinctType._param);
        }

        if (type instanceof OrType) {
            let orType = type as OrType;

            return orType.types.every((currentType) => this.matches(currentType));
        }

        throw new Error(`Unsupported type: ${type} (${typeof type})`);
    }


    isAny(): boolean {
        return false;
    }

    isVoid(): boolean {
        return false;
    }

    toDistinctType(): DistinctType {
        return this;
    }

    toScript(accent: string): string {
        let description: string = this._name;

        if (this._param) {
            description += `<${Utils.toScript(accent, this._param)}>`
        }

        return description;
    }

    toString(): string {
        return `DistinctType(${this._name}, ${this._param})`;
    }

}

export class OrType extends Type {

    constructor(private _types: Type[]) {
        super();

        Utils.requiredNotNull(_types, "Types is null");
    }

    get types() {
        return this._types;
    }

    accepts(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        return this._types.some((current) => type.accepts(current));
    }

    matches(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        return this._types.every((current) => type.matches(current));
    }


    isAny(): boolean {
        return this._types.every((type) => type.isAny());
    }

    isVoid(): boolean {
        return this._types.every((type) => type.isVoid());
    }

    toScript(accent: string): string {
        return this._types.map((type) => Utils.toScript(accent, type)).join(" | ");
    }

    toString(): string {
        return `OrType(${this._types})`;
    }

}

export class VoidType extends Type {

    constructor() {
        super();
    }

    accepts(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        return type.isVoid();
    }

    matches(type: Type): boolean {
        Utils.requiredNotNull(type, "Type is null");

        return type.isVoid();
    }

    isAny(): boolean {
        return false;
    }

    isVoid(): boolean {
        return true;
    }

    toScript(accent: string): string {
        return "Void";
    }

    toString(): string {
        return `VoidAny()`;
    }

}

export class Types {
    static ANY: Type = new AnyType();

    static BOOL: DistinctType = new DistinctType("Bool");

    static LIST: DistinctType = new DistinctType("List", Types.ANY);

    static MAP: DistinctType = new DistinctType("Map", Types.ANY);

    static PROCEDURE: DistinctType = new DistinctType("Procedure", Types.ANY);

    static QUANTITY: DistinctType = new DistinctType("Quantity");

    static TEXT: DistinctType = new DistinctType("Text");

    static TYPE: DistinctType = new DistinctType("Type");

    static UNIT: DistinctType = new DistinctType("Unit");

    static VOID: Type = new VoidType();

    static DEFINED: {
        [name: string]: {
            type: Type,
            hasParams: boolean
        }
    } = {
        "Bool": {
            type: Types.BOOL,
            hasParams: false
        },
        "List": {
            type: Types.LIST,
            hasParams: true
        },
        "Map": {
            type: Types.MAP,
            hasParams: true
        },
        "Procedure": {
            type: Types.PROCEDURE,
            hasParams: true
        },
        "Quantity": {
            type: Types.QUANTITY,
            hasParams: false
        },
        "Text": {
            type: Types.TEXT,
            hasParams: false
        },
        "Type": {
            type: Types.TYPE,
            hasParams: false
        },
        "Unit": {
            type: Types.UNIT,
            hasParams: false
        }
    };
}

function isBool(value: any) {
    return typeof value === "boolean";
}

function isList(value: any) {
    return Array.isArray(value);
}

function isMap(value: any) {
    return (value instanceof Object) && (!isList(value)) && (!isProcedure(value)) && (!isQuantity(value)) && (!isType(value)) && (!isUnit(value));
}

function isProcedure(value: any) {
    return value instanceof Procedure;
}

function isQuantity(value: any) {
    return value instanceof Quantity;
}

function isText(value: any) {
    return typeof value === "string";
}

function isType(value: any) {
    return value instanceof Type;
}

function isUnit(value: any) {
    return value instanceof Unit;
}

function isVoid(value: any) {
    return ((value === undefined) || (value === null));
}

