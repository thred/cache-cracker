import {Definition} from "./Definition";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";

import * as Code from "./Code";

export function populate(scope: Scope) {

    scope.register(new Definition("convert", "Converts the value to a quantity with the specified unit", {
        value: "The value",
        unit: "The unit"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("value").convert(scope.requiredAsUnit("unit"));
    }));

    scope.register(new Definition("positiveOf", "Keeps the value", {
        value: "The value"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("value");
    }));

    scope.register(new Definition("negativeOf", "Negates the value", {
        value: "The value"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("value").negate();
    }));

    scope.register(new Definition("add", "Adds the right quantity to the left one. This method is used for the '+' operation.", {
        left: "The left hand assignment",
        right: "The right hand assignment"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("left").add(scope.requiredAsQuantity("right"));
    }));

    scope.register(new Definition("subtract", "Subtracts the right quantity from the left one. This method is used for the '-' operation.", {
        left: "The left hand assignment",
        right: "The right hand assignment"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("left").subtract(scope.requiredAsQuantity("right"));
    }));

    scope.register(new Definition("multiply", "Mutiplies the left quantity with the right one. This method is used for the '*' operation.", {
        left: "The left hand assignment",
        right: "The right hand assignment"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("left").multiply(scope.requiredAsQuantity("right"));
    }));

    scope.register(new Definition("divide", "Divides the left quantity by the right one. This method is used for the '/' operation.", {
        left: "The left hand assignment",
        right: "The right hand assignment"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("left").divide(scope.requiredAsQuantity("right"));
    }));

    scope.register(new Definition("power", "Performs a power operation of the left quantity and the right one. This method is used for the '^' operation.", {
        left: "The left hand assignment",
        right: "The right hand assignment"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("left").power(scope.requiredAsQuantity("right"));
    }));

    scope.register(new Definition("modulo", "Performs a modulo operation of the left quantity and the right one. This method is used for the 'mod' operation.", {
        left: "The left hand assignment",
        right: "The right hand assignment"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("left").modulo(scope.requiredAsQuantity("right"));
    }));

    scope.register(new Definition("abs", "Compute the absolute value.", {
        value: "The value"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("value").abs();
    }));

    scope.register(new Definition("round", "Round the value to the specified number of digits.", {
        value: "The value",
        digits: "The number of digits (optional, default value is 0)"
    }, (scope: Scope) => {
        return scope.requiredAsQuantity("value").round(scope.getAsQuantity("digits", Quantity.ZERO));
    }));

}

