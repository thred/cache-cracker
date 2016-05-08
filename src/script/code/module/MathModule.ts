import {Module} from "./Module";

import {Definition} from "./../Definition";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

import * as Utils from "./../util/Utils";

class MathModule extends Module {

    constructor() {
        super();

        this.define(Definition.procedure("convert", "Converts the quantity to the specified unit.", [
            Definition.any("value", "The quantity"),
            Definition.any("unit", "The unit")
        ], Definition.quantity("quantity", "The converted value"), (scope: Scope) => {
            return scope.requiredAsQuantity("value").convert(scope.requiredAsUnit("unit"));
        }));

        this.define(Definition.procedure("chain", "Chains the quantities (e.g. 4 ft 2 in).", [
            Definition.any("values", "An array of quantities")
        ], Definition.quantity("quantity", "The sum of the chained quantities"), (scope: Scope) => {
            let leadingUnit: Unit = null;
            let array = scope.requiredAsList("values");
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

        this.define(Definition.procedure("positiveOf", "Negates the negated quantity", [
            Definition.any("value", "The quantity")
        ], Definition.quantity("quantity", "The quantity unmodified"), (scope: Scope) => {
            return scope.requiredAsQuantity("value");
        }));

        this.define(Definition.procedure("negativeOf", "Negates the quantity", [
            Definition.any("value", "The quantity")
        ], Definition.quantity("quantity", "The negated quantity"), (scope: Scope) => {
            return scope.requiredAsQuantity("value").negate();
        }));

        this.define(Definition.procedure("add", "Adds the right quantity to the left one. This method is used for the '+' operation.", [
            Definition.any("left", "The left hand quantity"),
            Definition.any("right", "The right hand quantity")
        ], Definition.quantity("quantity", "The result of the add operation"), (scope: Scope) => {
            return scope.requiredAsQuantity("left").add(scope.requiredAsQuantity("right"));
        }));

        this.define(Definition.procedure("subtract", "Subtracts the right quantity from the left one. This method is used for the '-' operation.", [
            Definition.any("left", "The left hand quantity"),
            Definition.any("right", "The right hand quantity")
        ], Definition.quantity("quantity", "The result of the subtract operation"), (scope: Scope) => {
            return scope.requiredAsQuantity("left").subtract(scope.requiredAsQuantity("right"));
        }));

        this.define(Definition.procedure("multiply", "Mutiplies the left quantity with the right one. This method is used for the '*' operation.", [
            Definition.any("left", "The left hand quantity"),
            Definition.any("right", "The right hand quantity")
        ], Definition.quantity("quantity", "The result of the multiply operation"), (scope: Scope) => {
            return scope.requiredAsQuantity("left").multiply(scope.requiredAsQuantity("right"));
        }));

        this.define(Definition.procedure("divide", "Divides the left quantity by the right one. This method is used for the '/' operation.", [
            Definition.any("left", "The left hand quantity"),
            Definition.any("right", "The right hand quantity")
        ], Definition.quantity("quantity", "The result of the divide operation"), (scope: Scope) => {
            return scope.requiredAsQuantity("left").divide(scope.requiredAsQuantity("right"));
        }));

        this.define(Definition.procedure("power", "Performs a power operation of the left quantity and the right one. This method is used for the '^' operation.", [
            Definition.any("left", "The left hand quantity"),
            Definition.any("right", "The right hand quantity")
        ], Definition.quantity("quantity", "The result of the power operation"), (scope: Scope) => {
            return scope.requiredAsQuantity("left").power(scope.requiredAsQuantity("right"));
        }));

        this.define(Definition.procedure("modulo", "Performs a modulo operation of the left quantity and the right one. This method is used for the 'mod' operation.", [
            Definition.any("left", "The left hand quantity"),
            Definition.any("right", "The right hand quantity")
        ], Definition.quantity("quantity", "The result of the modulo operation"), (scope: Scope) => {
            return scope.requiredAsQuantity("left").modulo(scope.requiredAsQuantity("right"));
        }));

        this.define(Definition.procedure("abs", "Ensures that the quantity has a positive value.", [
            Definition.any("value", "The quantity")
        ], Definition.quantity("quantity", "The quantity as positive value"), (scope: Scope) => {
            return scope.requiredAsQuantity("value").abs();
        }));

        this.define(Definition.procedure("round", "Rounds the quantity to the specified accuracy (e.g. 0.01).", [
            Definition.any("value", "The quantity"),
            Definition.any("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], Definition.quantity("quantity", "The rounded quantity"), (scope: Scope) => {
            return scope.requiredAsQuantity("value").round(scope.getAsQuantity("accuracy"));
        }));

        this.define(Definition.procedure("floor", "Returns the greatest quantity less or equal the specified quantity (with the specified accuracy, e.g. 0.01).", [
            Definition.any("value", "The quantity"),
            Definition.any("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], Definition.quantity("quantity", "The floored quantity"), (scope: Scope) => {
            return scope.requiredAsQuantity("value").floor(scope.getAsQuantity("accuracy"));
        }));

        this.define(Definition.procedure("ceil", "Returns the smallest quantity greater or equal the specified quantity (with the specified accuracy, e.g. 0.01).", [
            Definition.any("value", "The quantity"),
            Definition.any("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], Definition.quantity("quantity", "The ceiled quantity"), (scope: Scope) => {
            return scope.requiredAsQuantity("value").ceil(scope.getAsQuantity("accuracy"));
        }));

        this.define(Definition.procedure("random", "Returns a random quantity between (and including) 1 and the maximum value.", [
            Definition.any("maximum", "The maximum quantity"),
            Definition.any("accuracy", "The accuracy, default value is 1", Quantity.ONE)
        ], Definition.quantity("quantity", "The random quantity"), (scope: Scope) => {
            let quantity = scope.requiredAsQuantity("maximum");

            return new Quantity(Math.random() * quantity.value + 1, quantity.unit).floor(scope.getAsQuantity("accuracy"));
        }))
    }
}

export const MODULE = new MathModule();
