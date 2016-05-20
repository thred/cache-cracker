import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export const TRUE = Definition.bool(Globals.CONST_TRUE, {
    "": "The logical value: true",
    "de": "Der Wahrheitswert: wahr"
}, true);

export const FALSE = Definition.bool(Globals.CONST_FALSE, {
    "": "The logical value: false",
    "de": "Der Wahrheitswert: falsch"
}, false);

export const YES = Definition.bool(Globals.CONST_YES, {
    "": "An alternative logical value for: true",
    "de": "Ein alternativer Wahrheitswert für: wahr"
}, true);

export const NO = Definition.bool(Globals.CONST_NO, {
    "": "An alternative logical value for: false",
    "de": "Ein alternativer Wahrheitswert für: falsch"
}, false);

export const UNCHANGED = Definition.procedure(Globals.PROCEDURE_UNCHANGED, {
    "": "Returns the specified value unmodified.",
    "de": "Gibt den angegebenen Wert unmodifiziert zurück."
}, [Definition.any(Globals.VAR_VALUE, {
    "": "The value.",
    "de": "Der Wert."
})], Definition.quantity(Globals.VAR_RESULT, {
    "": "The value.",
    "de": "Der Wert."
}), (scope: Scope) => {
    return scope.required(Globals.VAR_VALUE);
});

export const MODULE: Module = new Module(TRUE, FALSE, YES, NO, UNCHANGED);
