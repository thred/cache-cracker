import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Types} from "./../Type";
import {Unit} from "./../Unit";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export const TRUE = Definition.bool(Globals.CONST_TRUE, {
    "": "The logical value: true.",
    "de": "Der Wahrheitswert: wahr."
}, true);

export const FALSE = Definition.bool(Globals.CONST_FALSE, {
    "": "The logical value: false.",
    "de": "Der Wahrheitswert: falsch."
}, false);

export const YES = Definition.bool(Globals.CONST_YES, {
    "": "An alternative logical value for: true.",
    "de": "Ein alternativer Wahrheitswert für: wahr."
}, true);

export const NO = Definition.bool(Globals.CONST_NO, {
    "": "An alternative logical value for: false.",
    "de": "Ein alternativer Wahrheitswert für: falsch."
}, false);

export const LIST = Definition.type(Globals.CONST_LIST, {
    "": "The type: List.",
    "de": "Der Typ: Liste."
}, Types.LIST);

export const LOGICAL_VALUE = Definition.type(Globals.CONST_LOGICAL_VALUE, {
    "": "The type: LogicalValue.",
    "de": "Der Typ: Wahrheitswert."
}, Types.LOGICAL_VALUE);

export const MAP = Definition.type(Globals.CONST_MAP, {
    "": "The type: Map.",
    "de": "Der Typ: Map."
}, Types.MAP);

export const PROCEDURE = Definition.type(Globals.CONST_PROCEDURE, {
    "": "The type: Procedure.",
    "de": "Der Typ: Prozedure."
}, Types.PROCEDURE);

export const QUANTITY = Definition.type(Globals.CONST_QUANTITY, {
    "": "The type: Quantity.",
    "de": "Der Typ: Quantität."
}, Types.QUANTITY);

export const TEXT = Definition.type(Globals.CONST_TEXT, {
    "": "The type: Text.",
    "de": "Der Typ: Text."
}, Types.TEXT);

export const TYPE = Definition.type(Globals.CONST_TYPE, {
    "": "The type: Type.",
    "de": "Der Typ: Typ."
}, Types.TYPE);

export const UNIT = Definition.type(Globals.CONST_UNIT, {
    "": "The type: Unit.",
    "de": "Der Typ: Einheit."
}, Types.UNIT);

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

export const MODULE: Module = new Module(TRUE, FALSE, YES, NO, LIST, LOGICAL_VALUE, MAP, PROCEDURE, QUANTITY, TEXT, TYPE, UNIT, UNCHANGED);
