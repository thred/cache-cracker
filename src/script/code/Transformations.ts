import {Definition} from "./Definition";
import {Module} from "./Module";
import {Procedure} from "./Procedure";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Type, DistinctType, Types} from "./Type";
import {Unit} from "./Unit";

import * as Globals from "./Globals";
import * as Utils from "./Utils";

export function to(accent: string, language: string, type: Type, value: any): any {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (type.acceptsValue(value)) {
        return value;
    }

    let distinctType: DistinctType = type.toDistinctType();

    switch (distinctType.name) {
        case "List":
            return toList(accent, language, value, type);

        case "LogicalValue":
            return toLogicalValue(accent, language, value, type);

        case "Map":
            return toMap(accent, language, value, type);

        case "Procedure":
            return toProcedure(accent, language, value, type);

        case "Quantity":
            return toQuantity(accent, language, value, type);

        case "Text":
            return toText(accent, language, value, type);

        case "Type":
            return toType(accent, language, value, type);

        case "Unit":
            return toUnit(accent, language, value, type);

        default:
            throw new Error(`Unsupported type: ${Utils.toScript(Globals.DEFAULT_ACCENT, type)}`);
    }
}

export function toLogicalValue(accent: string, language: string, value: any, typeParam?: Type): boolean {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.LOGICAL_VALUE.acceptsValue(value)) {
        return value;
    }

    throw new Error(`Conversion to LogicalValue failed: ${Utils.toScript(accent, value)}`);
}

export function toList(accent: string, language: string, value: any, typeParam?: Type): any[] {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.LIST.acceptsValue(value)) {
        return value;
    }

    throw new Error(`Conversion to List failed: ${Utils.toScript(accent, value)}`);
}

export function toMap(accent: string, language: string, value: any, typeParam?: Type): Utils.Map {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.MAP.acceptsValue(value)) {
        return value;
    }

    throw new Error(`Conversion to Map failed: ${Utils.toScript(accent, value)}`);
}

export function toProcedure(accent: string, language: string, value: any, typeParam?: Type): Procedure {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.PROCEDURE.acceptsValue(value)) {
        return value;
    }

    throw new Error(`Conversion to Procedure failed: ${Utils.toScript(accent, value)}`);
}

export function toQuantity(accent: string, language: string, value: any, typeParam?: Type): Quantity {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.TYPE.acceptsValue(value)) {
        return value;
    }

    if (typeof value === "number") {
        return new Quantity(value);
    }

    if (typeof value === "string") {
        return Quantity.parse(language, value as string);
    }

    throw new Error(`Conversion to Quantity failed: ${Utils.toScript(accent, value)}`);
}

export function toText(accent: string, language: string, value: any, typeParam?: Type): string {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.TEXT.acceptsValue(value)) {
        return value;
    }

    return value.toString();
}

export function toType(accent: string, language: string, value: any, typeParam?: Type): Type {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.TYPE.acceptsValue(value)) {
        return value;
    }

    throw new Error(`Conversion to Type failed: ${Utils.toScript(accent, value)}`);
}

export function toUnit(accent: string, language: string, value: any, typeParam?: Type): Unit {
    if ((value === undefined) || (value === null)) {
        return value;
    }

    if (Types.UNIT.acceptsValue(value)) {
        return value;
    }

    throw new Error(`Conversion to Unit failed: ${Utils.toScript(accent, value)}`);
}
