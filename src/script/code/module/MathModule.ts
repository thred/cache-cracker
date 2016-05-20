import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export const CONVERT = Definition.procedure(Globals.PROCEDURE_CONVERT, {
    "": "Converts the value to the specified unit. This is the default procedure used for unit conversions.",
    "de": "Rechnet die Wert in die angegebene Einheit um. Dies ist die Standardprozedur zur Umrechnung von Einheiten."
}, [Definition.any(Globals.VAR_VALUE, {
    "": "The value (interpretable as quantity).",
    "de": "Der Wert (interpretierbar als Quantität)."
}), Definition.any(Globals.VAR_UNIT, {
    "": "The unit.",
    "de": "Die Einheit."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The converted value.",
    "de": "Der umgerechnete Wert."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_VALUE).convert(scope.requiredAsUnit(Globals.VAR_UNIT));
});

export const JOIN_QUANTITIES = Definition.procedure(Globals.PROCEDURE_JOIN_QUANTITIES, {
    "": "Links the values in the list (e.g. 4 ft 2 in). This is the default procedure used for linking quantities.",
    "de": "Verbindet die Werte in der Liste. Dies ist die Standardprozedur zum Verbinden von Quantitäten."
}, [Definition.any(Globals.VAR_LIST, {
    "": "A list of values (interpretable as quantities).",
    "de": "Eine Liste von Werten (interpretierbar als Quantitäten)."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The sum the linked quantities.",
    "de": "Die Summe der verbundenen Quantitäten."
}), (scope: Scope) => {
    let leadingUnit: Unit = null;
    let list = scope.requiredAsList(Globals.VAR_LIST);
    let result: Quantity = null;

    for (let i = 0; i < list.length; i++) {
        let value: Quantity = scope.asQuantity(list[i]);

        if (value.unit.isUndefined()) {
            if (list.length > i + 1) {
                throw new Error("Unit missing. This is only allowed for the last item in the linked chain");
            }

            if (leadingUnit.subUnit) {
                value = scope.requiredAsProcedure(Globals.PROCEDURE_CONVERT).invoke({
                    value: value,
                    unit: leadingUnit.subUnit
                });
            }
        }
        else if ((leadingUnit) && (!leadingUnit.isPreceding(value.unit))) {
            throw new Error(`Unit ${Utils.toScript(scope.accent, value.unit)} cannot succeed unit ${Utils.toScript(scope.accent, leadingUnit)} in linked expressions`);
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

export const NEGATE = Definition.procedure(Globals.PROCEDURE_NEGATE, {
    "": "Negates the quantity. This is the default procedure for negating a quantity.",
    "de": "Negiert die Quantität. Dies ist die Standardprozedur um eine Quantität zu negieren."
}, [Definition.any(Globals.VAR_VALUE, {
    "": "The value (interpretable as quantity).",
    "de": "Der Wert (interpretierbar als Quantität)."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The negated value.",
    "de": "Der negierte Wert."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_VALUE).negate();
});

export const ADD = Definition.procedure(Globals.PROCEDURE_ADD, {
    "": "Adds the right quantity to the left one. This is the default procedure used for the '+' operation.",
    "de": "Addiert den rechten Wert zum linken. Dies ist die Standardprozedur für die '+' Operation."
}, [Definition.any(Globals.VAR_LEFT_VALUE, {
    "": "The left value.",
    "de": "Der linke Wert."
}), Definition.any(Globals.VAR_RIGHT_VALUE, {
    "": "The right value.",
    "de": "Der rechte Wert."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The result of the addition.",
    "de": "Das Ergebnis der Addition."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_LEFT_VALUE).add(scope.requiredAsQuantity(Globals.VAR_RIGHT_VALUE));
});

export const SUBTRACT = Definition.procedure(Globals.PROCEDURE_SUBTRACT, {
    "": "Subtracts the right quantity to the left one. This is the default procedure used for the '-' operation.",
    "de": "Subrahiert den rechten Wert vom linken. Dies ist die Standardprozedur für die '-' Operation."
}, [Definition.any(Globals.VAR_LEFT_VALUE, {
    "": "The left value.",
    "de": "Der linke Wert."
}), Definition.any(Globals.VAR_RIGHT_VALUE, {
    "": "The right value.",
    "de": "Der rechte Wert."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The result of the subtraction.",
    "de": "Das Ergebnis der Subtraktion."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_LEFT_VALUE).subtract(scope.requiredAsQuantity(Globals.VAR_RIGHT_VALUE));
});

export const MULTIPLY = Definition.procedure(Globals.PROCEDURE_MULTIPLY, {
    "": "Multiplies the left quantity with the right one. This is the default procedure used for the '*' operation.",
    "de": "Multipliziert den linken Wert mit dem rechten. Dies ist die Standardprozedur für die '*' Operation."
}, [Definition.any(Globals.VAR_LEFT_VALUE, {
    "": "The left value.",
    "de": "Der linke Wert."
}), Definition.any(Globals.VAR_RIGHT_VALUE, {
    "": "The right value.",
    "de": "Der rechte Wert."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The result of the multiplication.",
    "de": "Das Ergebnis der Multiplikation."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_LEFT_VALUE).multiply(scope.requiredAsQuantity(Globals.VAR_RIGHT_VALUE));
});

export const DIVIDE = Definition.procedure(Globals.PROCEDURE_DIVIDE, {
    "": "Divides the left quantity by the right one. This is the default procedure used for the '/' operation.",
    "de": "Dividiert den linken Wert durch den rechten. Dies ist die Standardprozedur für die '/' Operation."
}, [Definition.any(Globals.VAR_LEFT_VALUE, {
    "": "The left value.",
    "de": "Der linke Wert."
}), Definition.any(Globals.VAR_RIGHT_VALUE, {
    "": "The right value.",
    "de": "Der rechte Wert."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The result of the division.",
    "de": "Das Ergebnis der Division."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_LEFT_VALUE).divide(scope.requiredAsQuantity(Globals.VAR_RIGHT_VALUE));
});

export const EXPONENTIATE = Definition.procedure(Globals.PROCEDURE_EXPONENTIATE, {
    "": "Raises the left quantity to the power of the right one. This is the default procedure used for the '^' operation.",
    "de": "Potenziert den linken Wert mit dem rechten. Dies ist die Standardprozedur für die '^' Operation."
}, [Definition.any(Globals.VAR_LEFT_VALUE, {
    "": "The left value.",
    "de": "Der linke Wert."
}), Definition.any(Globals.VAR_RIGHT_VALUE, {
    "": "The right value.",
    "de": "Der rechte Wert."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The result of the exponentiation.",
    "de": "Das Ergebnis der Potenzierung."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_LEFT_VALUE).power(scope.requiredAsQuantity(Globals.VAR_RIGHT_VALUE));
});

export const MODULO = Definition.procedure(Globals.PROCEDURE_MODULO, {
    "": "Calculates the remainder after the division of the left quantity by the right one. This is the default procedure used for the 'mod' operation.",
    "de": "Berechnet den Rest der Division des linken Werts durch den rechten. Dies ist die Standardprozedur für die 'mod' Operation."
}, [Definition.any(Globals.VAR_LEFT_VALUE, {
    "": "The left value.",
    "de": "Der linke Wert."
}), Definition.any(Globals.VAR_RIGHT_VALUE, {
    "": "The right value.",
    "de": "Der rechte Wert."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The result of the modulo operation.",
    "de": "Das Ergebnis der Modulo-Operation."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_LEFT_VALUE).modulo(scope.requiredAsQuantity(Globals.VAR_RIGHT_VALUE));
});

export const ABSOLUTE = Definition.procedure(Globals.PROCEDURE_ABSOLUTE, {
    "": "Returns the aboslute value of the quantity.",
    "de": "Gibt the Absolutwert der Quantität zurück."
}, [Definition.any(Globals.VAR_VALUE, {
    "": "The value (interpretable as quantity).",
    "de": "Der Wert (interpretierbar als Quantität)."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The positive value.",
    "de": "Den positiven Wert."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_VALUE).abs();
});

export const ROUND = Definition.procedure(Globals.PROCEDURE_ROUND, {
    "": "Rounds the quantity to the specified accuracy (e.g. 0.01).",
    "de": "Rundet den Wert mit der angegebenen Genauikeit (z.B. 0.01)."
}, [Definition.any(Globals.VAR_VALUE, {
    "": "The value (interpretable as quantity).",
    "de": "Der Wert (interpretierbar als Quantität)."
}), Definition.any(Globals.VAR_ACCURACY, {
    "": "The accuracy of the operation (the default value is 1).",
    "de": "Die Genauigkeit der Operation (the Standardwert ist 1)."
}, Quantity.ONE)], Definition.quantity(Globals.VAR_RESULT, {
    "": "The rounded value.",
    "de": "Den gerundeten Wert."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_VALUE).round(scope.getAsQuantity(Globals.VAR_ACCURACY));
});

export const FLOOR = Definition.procedure(Globals.PROCEDURE_FLOOR, {
    "": "Returns the greatest quantity less or equal the specified quantity (with the specified accuracy, e.g. 0.01).",
    "de": "Gibt the größten Wert zurück, welche kleiner oder gleich dem angebenen Wert ist (mit der angegebenen Genauikeit, z.B. 0.01)."
}, [Definition.any(Globals.VAR_VALUE, {
    "": "The value (interpretable as quantity).",
    "de": "Der Wert (interpretierbar als Quantität)."
}), Definition.any(Globals.VAR_ACCURACY, {
    "": "The accuracy of the operation (the default value is 1).",
    "de": "Die Genauigkeit der Operation (the Standardwert ist 1)."
}, Quantity.ONE)], Definition.quantity(Globals.VAR_RESULT, {
    "": "The floored value.",
    "de": "Den abgerundeten Wert."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_VALUE).floor(scope.getAsQuantity(Globals.VAR_ACCURACY));
});

export const CEIL = Definition.procedure(Globals.PROCEDURE_CEIL, {
    "": "Returns the smallest quantity greater or equal the specified quantity (with the specified accuracy, e.g. 0.01).",
    "de": "Gibt den kleinsten Wert zurück, welche größer oder glich dem angegebenen Wert ist (mit der angegebenen Genauikeit, z.B. 0.01)."
}, [Definition.any(Globals.VAR_VALUE, {
    "": "The value (interpretable as quantity).",
    "de": "Der Wert (interpretierbar als Quantität)."
}), Definition.any(Globals.VAR_ACCURACY, {
    "": "The accuracy of the operation (the default value is 1).",
    "de": "Die Genauigkeit der Operation (the Standardwert ist 1)."
}, Quantity.ONE)], Definition.quantity(Globals.VAR_RESULT, {
    "": "The ceiled value.",
    "de": "Den aufgerundeten Wert."
}), (scope: Scope) => {
    return scope.requiredAsQuantity(Globals.VAR_VALUE).ceil(scope.getAsQuantity(Globals.VAR_ACCURACY));
});

export const RANDOM = Definition.procedure(Globals.PROCEDURE_RANDOM, {
    "": "Returns a random quantity between (and including) 1 and the maximum quantity.",
    "de": "Gibt eine zufällige Quantität zurück, die zwischen (inklusive) 1 und dem maximalen Wert liegt."
}, [Definition.any(Globals.VAR_MAXIMUM, {
    "": "The maximum quantity.",
    "de": "Die maximale Quantität."
}), Definition.any(Globals.VAR_ACCURACY, {
    "": "The accuracy of the operation (the default value is 1).",
    "de": "Die Genauigkeit der Operation (the Standardwert ist 1)."
}, Quantity.ONE)], Definition.quantity(Globals.VAR_RESULT, {
    "": "The random quantity.",
    "de": "Die zufällige Quantität."
}), (scope: Scope) => {
    let quantity = scope.requiredAsQuantity(Globals.VAR_MAXIMUM);

    return new Quantity(Math.random() * quantity.value + 1, quantity.unit).floor(scope.getAsQuantity(Globals.VAR_ACCURACY));
});

export const MODULE: Module = new Module(CONVERT, JOIN_QUANTITIES, NEGATE, ADD, SUBTRACT, MULTIPLY, DIVIDE, EXPONENTIATE, MODULO, ABSOLUTE, ROUND, FLOOR, CEIL, RANDOM);
