import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Scope} from "./../Scope";
import {Type} from "./../Type";

import * as Globals from "./../Globals";
import * as Transformations from "./../Transformations";

class TransformationModule extends Module {

    constructor() {
        super();

        this.register(Definition.procedure(Globals.PROCEDURE_TRANSFORM, {
            "": "Transforms the value to the specified type. Texts will be parsed according to the language settings.",
            "de": "Wandelt den Wert in den angegebenen Typ um. Texte werden entsprechend der Spracheeinstellung gelesen."
        }, [Definition.any(Globals.VAR_TYPE, {
            "": "The target type.",
            "de": "Der Zieltyp."
        }), Definition.any(Globals.VAR_VALUE, {
            "": "The value to be converted.",
            "de": "Der Wert, welcher konvertiert werden soll."
        }), Definition.any(Globals.VAR_LANGUAGE, {
            "": "The language (optional, falls back to the default language).",
            "de": "Die Sprache (optional, verwendet alternativ die Standardsparche)."
        }, null)], Definition.quantity(Globals.VAR_RESULT, {
            "": "The value in the specified type.",
            "de": "Der Wert im angegebenen Typ."
        }), (scope: Scope) => {
            let value: any = scope.required(Globals.VAR_VALUE);

            if (value === null) {
                return null;
            }

            let type: Type = scope.requiredAsType(Globals.VAR_TYPE);
            let language: string = scope.requiredAsText(Globals.VAR_LANGUAGE);

            if (!language) {
                language = scope.requiredAsText(Globals.VAR_DEFAULT_LANGUAGE);
            }

            return Transformations.to(scope.accent, language, type, value);
        }));
    }
}

export const MODULE = new TransformationModule();
