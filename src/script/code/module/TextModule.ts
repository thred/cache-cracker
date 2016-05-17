import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

class TextModule extends Module {

    constructor() {
        super();

        this.register(Definition.procedure(Globals.PROCEDURE_CONCAT, {
            "": "Concatenates the items of the list as text.",
            "de": "Verkettet die Elemente der Liste zu einem Text."
        }, [Definition.any(Globals.VAR_LIST, {
            "": "The list of values.",
            "de": "Die Liste der Werte."
        }), Definition.any(Globals.VAR_SEPARATOR, {
            "": "A text used as separator (optional, empty by default)",
            "de": "Ein Text als Separator (optional, leer, im Standardfall)"
        }, "")], Definition.text(Globals.VAR_RESULT, {
            "": "The concatenated values.",
            "de": "Die verketteten Werte."
        }), (scope: Scope) => {
            let list = scope.requiredAsList(Globals.VAR_LIST)

            if (list === null) {
                return null;
            }

            return list.join(scope.getAsText(Globals.VAR_SEPARATOR));
        }));
    }
}

export const MODULE = new TextModule();

