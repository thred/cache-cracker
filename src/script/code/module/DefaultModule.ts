import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";
import {Unit} from "./../Unit";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

class DefaultModule extends Module {

    constructor() {
        super();

        this.register(Definition.bool(Globals.CONST_TRUE, {
            "": "The logical value: true",
            "de": "Der Wahrheitswert: wahr"
        }, true));

        this.register(Definition.bool(Globals.CONST_FALSE, {
            "": "The logical value: false",
            "de": "Der Wahrheitswert: unwahr"
        }, false));

        this.register(Definition.procedure(Globals.PROCEDURE_LEAVE, {
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
        }));

    }
}

export const MODULE = new DefaultModule();
