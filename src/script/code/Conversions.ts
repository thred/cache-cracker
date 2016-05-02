import {Definition} from "./Definition";
import {Identifier} from "./Identifier";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Code from "./Code";
import * as Utils from "./Utils";

export function populate(scope: Scope) {
    scope.register(new Definition("asArray", "Convers the value to an array.", {
        value: "The value"
    }, (scope: Scope) => {
        let value = scope.required("value");

        if (value === null) {
            return null;
        }

        if (Array.isArray(value)) {
            return value;
        }

        throw new Error(`Conversion to Array failed: ${value}`);
    }));

    scope.register(new Definition("asIdentifier", "Converts the value to an identifier.", {
        value: "The value"
    }, (scope: Scope) => {
        let value = scope.required("value");

        if ((value === undefined) || (value === null)) {
            return value;
        }

        if (value instanceof Identifier) {
            return value;
        }

        return Identifier.parse(scope.requiredAsString("language"), value);
    }));

    scope.register(new Definition("asQuantity", "Converts the value to a quantity.", {
        value: "The value"
    }, (scope: Scope) => {
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
    }));

    scope.register(new Definition("asString", "Converts the value to a string.", {
        value: "The value"
    }, (scope: Scope) => {
        let value = scope.required("value");

        if (!(value)) {
            return null;
        }

        if (typeof value === "string") {
            return value;
        }


        return value.toString();
    }));

    scope.register(new Definition("asUnit", "Converts the value to a unit.", {
        value: "The value"
    }, (scope: Scope) => {
        let value = scope.required("value");

        if (value === null) {
            return null;
        }

        if (value instanceof Unit) {
            return value as Unit;
        }

        throw new Error(`Conversion to Unit failed: ${value}`);
    }));
}