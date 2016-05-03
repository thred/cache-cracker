import {Context} from "./Context";
import {Definition} from "./Definition";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";

import * as Code from "./Code";
import * as Definitions from "./Definitions";

export function populate(context: Context) {

    context.defineProcedure("convert", "Converts the value to a quantity with the specified unit", [
        new Definitions.Variable("value", "The value"),
        new Definitions.Variable("unit", "The unit")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").convert(scope.requiredAsUnit("unit"));
    });

    context.defineProcedure("positiveOf", "Keeps the value", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value");
    });

    context.defineProcedure("negativeOf", "Negates the value", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").negate();
    });

    context.defineProcedure("add", "Adds the right quantity to the left one. This method is used for the '+' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").add(scope.requiredAsQuantity("right"));
    });

    context.defineProcedure("subtract", "Subtracts the right quantity from the left one. This method is used for the '-' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").subtract(scope.requiredAsQuantity("right"));
    });

    context.defineProcedure("multiply", "Mutiplies the left quantity with the right one. This method is used for the '*' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").multiply(scope.requiredAsQuantity("right"));
    });

    context.defineProcedure("divide", "Divides the left quantity by the right one. This method is used for the '/' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").divide(scope.requiredAsQuantity("right"));
    });

    context.defineProcedure("power", "Performs a power operation of the left quantity and the right one. This method is used for the '^' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").power(scope.requiredAsQuantity("right"));
    });

    context.defineProcedure("modulo", "Performs a modulo operation of the left quantity and the right one. This method is used for the 'mod' operation.", [
        new Definitions.Variable("left", "The left hand assignment"),
        new Definitions.Variable("right", "The right hand assignment")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("left").modulo(scope.requiredAsQuantity("right"));
    });

    context.defineProcedure("abs", "Compute the absolute value.", [
        new Definitions.Variable("value", "The value")
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").abs();
    });

    context.defineProcedure("round", "Round the value to the specified number of digits.", [
        new Definitions.Variable("value", "The value"),
        new Definitions.Variable("digits", "The number of digits", new Quantity(0))
    ], (scope: Scope) => {
        return scope.requiredAsQuantity("value").round(scope.getAsQuantity("digits", Quantity.ZERO));
    });

}

