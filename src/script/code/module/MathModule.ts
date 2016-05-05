import {Module} from "./Module";

import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

class MathModule extends Module {

    constructor() {
        super();

        this.define(this.procedure("convert", "Converts the value to a quantity with the specified unit.", [
            this.parameter("value", "The value, interpretable as Quantity"),
            this.parameter("unit", "The unit, interpretable as Unit")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value").convert(scope.requiredAsUnit("unit"));
        }));

        this.define(this.procedure("chain", "Chains the values (e.g. 4 ft 2 in).", [
            this.parameter("values", "A list of values, interpretable as Quantities")
        ], (scope: Scope) => {
            let leadingUnit: Unit = null;
            let list = scope.requiredAsList("values");
            let result: Quantity = null;

            for (let i = 0; i < list.size; i++) {
                let value: Quantity = scope.asQuantity(list.get(i));

                if (value.unit.isUndefined()) {
                    if (list.size > i + 1) {
                        throw new Error("Unit missing. This is only allowed for the last item in the chain");
                    }

                    if (leadingUnit.subUnit) {
                        value = scope.invoke("convert", {
                            value: value,
                            unit: leadingUnit.subUnit
                        });
                    }
                }
                else if ((leadingUnit) && (!leadingUnit.isPreceding(value.unit))) {
                    throw new Error(`Unit ${value.unit.describe()} cannot succeed unit ${leadingUnit.describe()} in chained expressions`);
                }

                if (result) {
                    result = result.add(value)
                }
                else {
                    result = value;
                }

                leadingUnit = value.unit;
            }

            return result;
        }));

        this.define(this.procedure("positiveOf", "Keeps the value", [
            this.parameter("value", "The value")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value");
        }));

        this.define(this.procedure("negativeOf", "Negates the value", [
            this.parameter("value", "The value")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value").negate();
        }));

        this.define(this.procedure("add", "Adds the right quantity to the left one. This method is used for the '+' operation.", [
            this.parameter("left", "The left hand assignment"),
            this.parameter("right", "The right hand assignment")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("left").add(scope.requiredAsQuantity("right"));
        }));

        this.define(this.procedure("subtract", "Subtracts the right quantity from the left one. This method is used for the '-' operation.", [
            this.parameter("left", "The left hand assignment"),
            this.parameter("right", "The right hand assignment")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("left").subtract(scope.requiredAsQuantity("right"));
        }));

        this.define(this.procedure("multiply", "Mutiplies the left quantity with the right one. This method is used for the '*' operation.", [
            this.parameter("left", "The left hand assignment"),
            this.parameter("right", "The right hand assignment")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("left").multiply(scope.requiredAsQuantity("right"));
        }));

        this.define(this.procedure("divide", "Divides the left quantity by the right one. This method is used for the '/' operation.", [
            this.parameter("left", "The left hand assignment"),
            this.parameter("right", "The right hand assignment")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("left").divide(scope.requiredAsQuantity("right"));
        }));

        this.define(this.procedure("power", "Performs a power operation of the left quantity and the right one. This method is used for the '^' operation.", [
            this.parameter("left", "The left hand assignment"),
            this.parameter("right", "The right hand assignment")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("left").power(scope.requiredAsQuantity("right"));
        }));

        this.define(this.procedure("modulo", "Performs a modulo operation of the left quantity and the right one. This method is used for the 'mod' operation.", [
            this.parameter("left", "The left hand assignment"),
            this.parameter("right", "The right hand assignment")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("left").modulo(scope.requiredAsQuantity("right"));
        }));

        this.define(this.procedure("abs", "Compute the absolute value.", [
            this.parameter("value", "The value")
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value").abs();
        }));

        this.define(this.procedure("round", "Round the value to the specified number of digits.", [
            this.parameter("value", "The value"),
            this.parameter("digits", "The number of digits", new Quantity(0))
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value").round(scope.getAsQuantity("digits", Quantity.ZERO));
        }));
    }
}

export const MODULE = new MathModule();
