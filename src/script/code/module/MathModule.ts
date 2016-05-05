import {Module} from "./Module";

import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

import * as Utils from "./../util/Utils";

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
            this.parameter("values", "An array of values, interpretable as Quantities")
        ], (scope: Scope) => {
            let leadingUnit: Unit = null;
            let array = scope.requiredAsArray("values");
            let result: Quantity = null;

            for (let i = 0; i < array.length; i++) {
                let value: Quantity = scope.asQuantity(array[i]);

                if (value.unit.isUndefined()) {
                    if (array.length > i + 1) {
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

        this.define(this.procedure("round", "Rounds the value to the specified accuracy (e.g. 0.01).", [
            this.parameter("value", "The value"),
            this.parameter("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value").round(scope.getAsQuantity("accuracy"));
        }));

        this.define(this.procedure("floor", "Returns the greatest number less or equal the specified number (with the specified accuracy, e.g. 0.01).", [
            this.parameter("value", "The value"),
            this.parameter("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value").floor(scope.getAsQuantity("accuracy"));
        }));

        this.define(this.procedure("ceil", "Returns the smallest number greater or equal the specified number (with the specified accuracy, e.g. 0.01).", [
            this.parameter("value", "The value"),
            this.parameter("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], (scope: Scope) => {
            return scope.requiredAsQuantity("value").ceil(scope.getAsQuantity("accuracy"));
        }));

        this.define(this.procedure("random", "Returns a random number between (and including) 1 and the maximum value.", [
            this.parameter("maximum", "The maximum value"),
            this.parameter("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], (scope: Scope) => {
            let quantity = scope.requiredAsQuantity("maximum");

            return new Quantity(Math.random() * quantity.value + 1, quantity.unit).floor(scope.getAsQuantity("accuracy"));
        }))
    }
}

export const MODULE = new MathModule();
