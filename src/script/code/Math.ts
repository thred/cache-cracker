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

        for (let i = 0; i < list.size; i++) {
            let item: Quantity = scope.asQuantity(list.get(i));

            if (item.unit.isUndefined()) {
                if (list.size > i + 1) {
                    
                }
            }

            if (leadingUnit) {
                if (!leadingUnit.isPreceding(item.))
            }
        }




        let left = scope.requiredAsQuantity("left");
        let right = scope.requiredAsQUantity("rig")

        return .add(scope.requiredAsQuantity("right"));
    });



    let values: any[] = scope.requiredAsList("values");
    let index = 0;

    function get(): any {
        return (index < values.length) ? values[index] : undefined;
    }

    function next(): any {
        if (index + 1 < values.length) {
            return undefined;
        }

        return values[++index];
    }

    function lookAhead(): any {
        return (index + 1 < values.length) ? values[index + 1] : undefined;
    }

    if (lookAhead instanceof Unit) {

    }





    // while (values.length) {
    //     let value = values.shift();

    //     if ()



    // }

    // if (left instanceof Quantity) {
    //     if (right instanceof Quantity) {
    //         return (left as Quantity).chain(right as Quantity);
    //     }

    //     if (right instanceof Unit) {
    //         return (left as Quantity).convert(right as Unit);
    //     }

    //     if (typeof right === "string") {
    //         return (left as Quantity).chain(scope.requiredAsQuantity(right));
    //     }


    // }



    //     // return .chain(scope.requiredAsQuantity("right"));
    //     return null;
    // });

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

