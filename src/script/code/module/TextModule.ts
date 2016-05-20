import {Definition, ProcedureDefinition} from "./../Definition";
import {Module} from "./../Module";
import {Quantity} from "./../Quantity";
import {Scope} from "./../Scope";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

import {CharacterValueRuleParser} from "./../parser/CharacterValueRuleParser";

const DIACRITICS: { [character: string]: string } = {
    "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U",
    "à": "a", "è": "e", "ì": "i", "ò": "i", "ù": "u",
    "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U", "Ý": "Y",
    "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ý": "y",
    "Â": "A", "Ê": "E", "Î": "I", "Ô": "O", "Û": "U",
    "â": "a", "ê": "e", "î": "i", "ô": "o", "û": "u",
    "Ã": "A", "Ñ": "N", "Õ": "O",
    "ã": "a", "ñ": "n", "õ": "o",
    "Ä": "Ae", "Ë": "E", "Ï": "I", "Ö": "Oe", "Ü": "Ue",
    "ä": "ae", "ë": "e", "ï": "i", "ö": "oe", "ü": "ue",
    "ç": "c", "Ç": "C",
    "ß": "ss",
    "Ø": "O", "ø": "o",
    "Å": "A", "å": "a", "Æ": "Ae", "æ": "ae",
    "Ð": "D", "ð": "d"
};

export const JOIN_TEXTS: ProcedureDefinition = Definition.procedure(Globals.PROCEDURE_JOIN_TEXTS, {
    "": "Joins the items of the list as text.",
    "de": "Verbindet die Elemente der Liste zu einem Text."
}, [Definition.any(Globals.VAR_LIST, {
    "": "The list of values.",
    "de": "Die Liste der Werte."
}), Definition.any(Globals.VAR_SEPARATOR, {
    "": "A text used as separator (optional, empty by default)",
    "de": "Ein Text als Separator (optional, leer, im Standardfall)"
}, "")], Definition.text(Globals.VAR_RESULT, {
    "": "The joined values.",
    "de": "Die verbundenen Werte."
}), (scope: Scope) => {
    let list = scope.requiredAsList(Globals.VAR_LIST)

    if (list === null) {
        return null;
    }

    return list.join(scope.getAsText(Globals.VAR_SEPARATOR));
});

export const SIMPLIFY_CHARACTERS: ProcedureDefinition = Definition.procedure({
    "": "simplifyCharacters",
    "de": "vereinfacheZeichen"
}, {
        "": "Removes diacritics (ä \u2192 ae, é \u2192 e, ß \u2192 ss, ...).",
        "de": "Entfernt Diakritikas (ä \u2192 ae, é \u2192 e, ß \u2192 ss, ...)."
    }, [Definition.any(Globals.VAR_TEXT, {
        "": "The text, that should be simplified.",
        "de": "Der Text der vereinfacht werden soll."
    })], Definition.text(Globals.VAR_RESULT, {
        "": "The simplified text.",
        "de": "Der vereinfachte Text."
    }), (scope: Scope) => {
        let text = scope.requiredAsText(Globals.VAR_TEXT);

        return simplifyCharacters(text);
    });

export const COUNT_CHARACTERS: ProcedureDefinition = Definition.procedure({
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
    }, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÞþÐð"), Definition.any(Globals.VAR_SENSITIVE, {
        "": "If true, the procedure respects the type case (default value is false).",
        "de": "Wenn wahr repektiert die Prozedur die Groß-/Kleinschreibung (unwahr im Standardfall)."
    }, false)], Definition.quantity(Globals.VAR_RESULT, {
        "": "The number of the specified characters in the text.",
        "de": "Die Anzhal der angegebenen Zeichen im Text."
    }), (scope: Scope) => {
        let text = scope.requiredAsText(Globals.VAR_TEXT);
        let characters = scope.requiredAsText(Globals.VAR_CHARACTERS);
        let sensitive = scope.requiredAsLogicalValue(Globals.VAR_SENSITIVE);

        return Quantity.of(countCharacters(text, characters, sensitive));
    });

export const CHARACTER_VALUES: ProcedureDefinition = Definition.procedure({
    "": "toCharacterValues",
    "de": "alsZeichenwerte"
}, {
        "": "Converts the characters of the text to a list of quantities, e.g. A=1, B=2, ...",
        "de": "Wandelt die Zeiche des Texts in eine Liste von Quantitäten um, z.B. A=1, B=2, ..."
    }, [Definition.any(Globals.VAR_TEXT, {
        "": "The text.",
        "de": "Der Text."
    }), Definition.any(Globals.VAR_RULES, {
        "": "The rules for computing the values, comma-separated. Ranges can be defined using ellipsis. The default is: \"A=1 .. Z=26\".",
        "de": "Die Regeln um die Werte zu berechnen, getrennt durch Commas. Bereiche können durch Auslassungspunkte erzeugt werden. Der Standardwert ist: \"A=1 .. Z=26\"."
    }, "A=1 .. Z=26"), Definition.any(Globals.VAR_SENSITIVE, {
        "": "If true, the procedure respects the type case (default value is false).",
        "de": "Wenn wahr repektiert die Prozedur die Groß-/Kleinschreibung (unwahr im Standardfall)."
    }, false)], Definition.list(Globals.VAR_RESULT, {
        "": "A list of quantities.",
        "de": "Eine Liste von Quantitäten."
    }), (scope: Scope) => {
        let text = scope.requiredAsText(Globals.VAR_TEXT);
        let rules = scope.requiredAsText(Globals.VAR_RULES);
        let sensitive = scope.requiredAsLogicalValue(Globals.VAR_SENSITIVE);

        return characterValues(text, rules, "", sensitive); // FIXME where to get the language from
    });

export const MODULE: Module = new Module(JOIN_TEXTS, SIMPLIFY_CHARACTERS, COUNT_CHARACTERS, CHARACTER_VALUES);

function simplifyCharacters(text: string, additionalDiacritics?: { [character: string]: string }): string {
    if ((text === undefined) || (text === null)) {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length; i++) {
        let ch = text.charAt(i);

        if ((additionalDiacritics) && (additionalDiacritics[ch])) {
            ch = additionalDiacritics[ch];
        }
        else if (DIACRITICS[ch]) {
            ch = DIACRITICS[ch];
        }

        result += ch;
    }

    return result;
}

function countCharacters(text: string, characters: string, caseSensitive: boolean = false): number {
    if ((text === undefined) || (text === null)) {
        return 0;
    }

    if (!caseSensitive) {
        text = text.toLowerCase();
        characters = characters.toLowerCase();
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

function characterValues(text: string, rules: string = "A=1..Z", language: string = "", caseSensitive: boolean = false): Quantity[] {
    if ((text === undefined) || (text === null)) {
        return [];
    }

    let ruleMap: { [character: string]: number } = new CharacterValueRuleParser(language, rules, !caseSensitive).parse();

    if (!caseSensitive) {
        text = text.toLowerCase();
    }

    let result: Quantity[] = [];

    for (let i = 0; i < text.length; i++) {
        let ch = text.charAt(i);

        if (ruleMap[ch]) {
            result.push(Quantity.of(ruleMap[ch]));
        }
    }

    return result;
}
