import {Code} from "./Code";
import {Definition} from "./Definition";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Definitions from "./Definitions";

export function populate(code: Code) {

    code.defineProcedure("convert", "Converts the value to a quantity with the specified unit.", [
        new Definitions.Variable("value", "The value, interpretable as Quantity"),
        new Definitions.Variable("unit", "The unit, interpretable as Unit")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").convert(scope.requiredAsUnit("unit"));
    });

    code.defineProcedure("chain", "Chains the values (e.g. 4 ft 2 in).", [
        new Definitions.Variable("values", "A list of values, interpretable as Quantities")
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
    });

    code.defineProcedure("positiveOf", "Keeps the value", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value");
    });

    code.defineProcedure("negativeOf", "Negates the value", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").negate();
    });

    code.defineProcedure("add", "Adds the right quantity to the left one. This method is used for the '+' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").add(scope.requiredAsQuantity("right"));
    });

    code.defineProcedure("subtract", "Subtracts the right quantity from the left one. This method is used for the '-' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").subtract(scope.requiredAsQuantity("right"));
    });

    code.defineProcedure("multiply", "Mutiplies the left quantity with the right one. This method is used for the '*' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").multiply(scope.requiredAsQuantity("right"));
    });

    code.defineProcedure("divide", "Divides the left quantity by the right one. This method is used for the '/' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").divide(scope.requiredAsQuantity("right"));
    });

    code.defineProcedure("power", "Performs a power operation of the left quantity and the right one. This method is used for the '^' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").power(scope.requiredAsQuantity("right"));
    });

    code.defineProcedure("modulo", "Performs a modulo operation of the left quantity and the right one. This method is used for the 'mod' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").modulo(scope.requiredAsQuantity("right"));
    });

    code.defineProcedure("abs", "Compute the absolute value.", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").abs();
    });

    code.defineProcedure("round", "Round the value to the specified number of digits.", [
        new Definitions.Variable("value", "The value"),
        new Definitions.Variable("digits", "The number of digits", new Quantity(0))
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").round(scope.getAsQuantity("digits", Quantity.ZERO));
    });

}

