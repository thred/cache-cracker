import {Scope} from "./Scope";

import * as Code from "./Code";

export function populate(scope: Scope) {

    scope.register({
        name: "convert",
        description: "Converts the value to a quantity with the specified unit",
        parameters: {
            value: "The value",
            unit: "The unit"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("value").convert(scope.requiredAsUnit("unit"));
        }
    });

    scope.register({
        name: "positiveOf",
        description: "Keeps the value",
        parameters: {
            value: "The value"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("value");
        }
    });

    scope.register({
        name: "negativeOf",
        description: "Negates the value",
        parameters: {
            value: "The value"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("value").negate();
        }
    });

    scope.register({
        name: "chain",
        description: "Chains the left quantity and the right one (e.g. 3 ft 2 in). This method is used for chaining operation.",
        parameters: {
            left: "The left hand assignment",
            right: "The right hand assignment"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("left").chain(scope.requiredAsQuantity("right"));
        }
    });

    scope.register({
        name: "add",
        description: "Adds the right quantity to the left one. This method is used for the '+' operation.",
        parameters: {
            left: "The left hand assignment",
            right: "The right hand assignment"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("left").add(scope.requiredAsQuantity("right"));
        }
    });

    scope.register({
        name: "subtract",
        description: "Subtracts the right quantity from the left one. This method is used for the '-' operation.",
        parameters: {
            left: "The left hand assignment",
            right: "The right hand assignment"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("left").subtract(scope.requiredAsQuantity("right"));
        }
    });

    scope.register({
        name: "multiply",
        description: "Mutiplies the left quantity with the right one. This method is used for the '*' operation.",
        parameters: {
            left: "The left hand assignment",
            right: "The right hand assignment"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("left").multiply(scope.requiredAsQuantity("right"));
        }
    });

    scope.register({
        name: "divide",
        description: "Divides the left quantity by the right one. This method is used for the '/' operation.",
        parameters: {
            left: "The left hand assignment",
            right: "The right hand assignment"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("left").divide(scope.requiredAsQuantity("right"));
        }
    });

    scope.register({
        name: "power",
        description: "Performs a power operation of the left quantity and the right one. This method is used for the '^' operation.",
        parameters: {
            left: "The left hand assignment",
            right: "The right hand assignment"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("left").power(scope.requiredAsQuantity("right"));
        }
    });

    scope.register({
        name: "modulo",
        description: "Performs a modulo operation of the left quantity and the right one. This method is used for the 'mod' operation.",
        parameters: {
            left: "The left hand assignment",
            right: "The right hand assignment"
        },
        fn: (scope: Scope) => {
            return scope.requiredAsQuantity("left").modulo(scope.requiredAsQuantity("right"));
        }
    });
}

