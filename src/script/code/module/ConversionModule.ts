import {Module} from "./Module";

import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

class ConversionModule extends Module {

    init() {
        // TODO asList
        // TODO asMap

        this.define(this.procedure("asQuantity", "Converts the value to a quantity.", [
            this.parameter("value", "The value")
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
        }));

        this.define(this.procedure("asString", "Converts the value to a string.", [
            this.parameter("value", "The value")
        ], (scope: Scope) => {
            let value = scope.required("value");

            if (!(value)) {
                return null;
            }

            if (typeof value === "string") {
                return value;
            }


            return value.toString();
        }));

        this.define(this.procedure("asUnit", "Converts the value to a unit.", [
            this.parameter("value", "The value")
        ], (scope: Scope) => {
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
}

export const MODULE = new ConversionModule();
