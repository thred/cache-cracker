import {Code} from "./Code";
import {Definition} from "./Definition";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Definitions from "./Definitions";
import * as Utils from "./Utils";

export function populate(code: Code) {
    // TODO asList
    // TODO asMap
    
    // code.defineProcedure("asArray", "Convers the value to an array.", [
    //     new Definitions.Variable("value", "The value")
    // ], (scope: Scope) => {
    //     let value = scope.required("value");

    //     if (value === null) {
    //         return null;
    //     }

    //     if (Array.isArray(value)) {
    //         return value;
    //     }

    //     throw new Error(`Conversion to Array failed: ${value}`);
    // });

    // code.defineProcedure("asIdentifier", "Converts the value to an identifier.", [
    //     new Definitions.Variable("value", "The value")
    // ], (scope: Scope) => {
    //     let value = scope.required("value");

    //     if ((value === undefined) || (value === null)) {
    //         return value;
    //     }

    //     if (value instanceof Identifier) {
    //         return value;
    //     }

    //     return Identifier.parse(scope.requiredAsString("language"), value);
    // });

    code.defineProcedure("asQuantity", "Converts the value to a quantity.", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        let value = scope.required("value");

        if (value === null) {
            return null;
        }

        if (value instanceof Quantity) {
            return value as Quantity;
        }

        if (typeof value === "number") {
            return new Quantity(value);
        }

        if (typeof value === "string") {
            return Quantity.parse(scope.requiredAsString("language"), value as string);
        }

        throw new Error(`Conversion to Quantity failed: ${value}`);
    });

    code.defineProcedure("asString", "Converts the value to a string.", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        let value = scope.required("value");

        if (!(value)) {
            return null;
        }

        if (typeof value === "string") {
            return value;
        }


        return value.toString();
    });

    code.defineProcedure("asUnit", "Converts the value to a unit.", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        let value = scope.required("value");

        if (value === null) {
            return null;
        }

        if (value instanceof Unit) {
            return value as Unit;
        }

        throw new Error(`Conversion to Unit failed: ${value}`);
    });
}