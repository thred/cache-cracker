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

        this.register(Definition.procedure(Globals.PROCEDURE_NOP, {
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
