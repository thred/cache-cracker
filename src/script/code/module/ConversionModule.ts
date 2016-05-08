import {Module} from "./Module";

import {Definition} from "./../Definition";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

class ConversionModule extends Module {

    constructor() {
        super();

        // this.define(Definition.procedure("as", "Converts the value to the specified type or unit."), [
        //     Definition.any("value", "The value to be converted."),
        //     Definition.of("target", "Type | Unit", "The type or unit the value should be convertered to.")
        // ], Definition.any("any", "The result of the conversion"), (scope: Scope) => {

        // });
        
        // TODO asBoolean
        // TODO asList
        // TODO asMap
        // TODO asProcedure

        this.define(Definition.procedure("asQuantity", "Converts the value to a quantity.", [
            Definition.any("value", "The value, interpretable as quantity")
        ], Definition.quantity("quantity", "The value as Quantity"), (scope: Scope) => {
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
                return Quantity.parse(scope.requiredAsText("language"), value as string);
            }

            throw new Error(`Conversion to Quantity failed: ${value}`);
        }));

        this.define(Definition.procedure("asText", "Converts the value to a text.", [
            Definition.any("value", "The value, interpretable as text")
        ], Definition.text("text", "The value as Text"), (scope: Scope) => {
            let value = scope.required("value");

            if (!(value)) {
                return null;
            }

            if (typeof value === "string") {
                return value;
            }


            return value.toString();
        }));

        this.define(Definition.procedure("asUnit", "Converts the value to a unit.", [
            Definition.any("value", "The value, interpretable as value")
        ], Definition.unit("unit", "The value as Unit"), (scope: Scope) => {
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
