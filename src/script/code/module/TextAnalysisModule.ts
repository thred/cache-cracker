import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

class TextAnalysisModule extends Module {

    constructor() {
        super();

        this.register(Definition.procedure({
            "": "countCharacters",
            "de": "zähleZeichen"
        }, {
                "": "Counts the occurance of characters in the specified text (by default, all letters and digits).",
                "de": "Zählt die Anzahl der Zeichen im angegebenen Text (im Standardfall, alle Buchstaben und Zahlen)."
            }, [Definition.any(Globals.VAR_TEXT, {
                "": "The text for counting the characters.",
                "de": "Der Text in dem die Zeichen gezählt werden sollen."
            }), Definition.any(Globals.VAR_CHARACTERS, {
                "": "A text containing all characters, that should be counted (optional).",
                "de": "Ein Text der alle zu Zeichen enthält, die mitgezählt werden sollen (optional)."
            }, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÞþÐð")], Definition.quantity(Globals.VAR_RESULT, {
                "": "The number of the specified characters in the text.",
                "de": "Die Anzhal der angegebenen Zeichen im Text."
            }), (scope: Scope) => {
                let text = scope.requiredAsText(Globals.VAR_TEXT);
                let characters = scope.requiredAsText(Globals.VAR_CHARACTERS);

                return Quantity.of(countCharacters(text, characters));
            }));
    }
}

function countCharacters(text: string, characters: string): number {
    if ((text === undefined) || (text === null)) {
        return 0;
    }

    let count = 0;

    for (let i = 0; i < text.length; i++) {
        let ch = text.charAt(i);

        if (characters.indexOf(ch) >= 0) {
            count++;
        }
    }

    return count;
}

export const MODULE = new TextAnalysisModule();

