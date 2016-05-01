import * as Code from "./Code";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";
import * as Utils from "./Utils";

export function populate(scope: Scope) {
    scope.register({
        name: "asString",
        description: "Converts the value to a string.",
        parameters: {
            value: "The value"
        },
        fn: (scope: Scope) => {
            let value = scope.required("value");

            if (!(value)) {
                return null;
            }

            if (typeof value === "string") {
                return value;
            }


            return value.toString();
        }
    });

    scope.register({
        name: "asQuantity",
        description: "Converts the value to a quantity.",
        parameters: {
            value: "The value"
        },
        fn: (scope: Scope) => {
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
        }
    });

    scope.register({
        name: "asUnit",
        description: "Converts the value to a unit.",
        parameters: {
            value: "The value"
        },
        fn: (scope: Scope) => {
            let value = scope.required("value");

            if (value === null) {
                return null;
            }

            if (value instanceof Unit) {
                return value as Unit;
            }

            throw new Error(`Conversion to Unit failed: ${value}`);
        }
    });
}