let msgs: { [key: string]: { [language: string]: string } } =
    {
        "Global.decimalSeparators": {
            "": ".",
            "de": ","
        },

        "Global.digitSeparators": {
            "": ",\u00a0 ",
            "de": ".\u00a0 "
        },





        "Sheet.defaultName": {
            "": "My Cache-Cracker Sheet",
            "de": "Mein Cache-Cracker Zettel"
        },

        "Sheet.defaultComment": {
            "": "No commentary available.",
            "de": "Keine Beschreibung verfügbar."
        },

        "Instruction.function": {
            "": "Selected Function",
            "de": "Ausgewählte Funktion"
        },

        "Command.String.title": {
            "": "Enter a Character, Word or a Sentence",
            "de": "Ein Zeichen, Wort oder einen Satz eingeben"
        },

        "Command.String.label": {
            "": "The Character, Word or Sentence",
            "de": "Das Zeichen, das Wort oder der Satz"
        },

        "Command.Number.title": {
            "": "Enter a Number",
            "de": "Eine Zahl eingeben"
        },

        "Command.Number.label": {
            "": "The Number",
            "de": "Die Zahl"
        },

        "Command.Boolean.title": {
            "": "Enter a Logical Value",
            "de": "Einen Wahrheitswert eingeben"
        },

        "Command.Boolean.label": {
            "": "The Logical Value",
            "de": "Der Wahrheitswert"
        },

        "Command.category.Input.title": {
            "": "Enter Input",
            "de": "Eingaben"
        },




        "Unit.m": {
            "": "Meter"
        },

    };

function getLanguage() {
    return "en-US";
}

export function msg(languageOrKey: string, key?: string) {
    if (!key) {
        key = languageOrKey;
        languageOrKey = getLanguage();
    }

    let translations = msgs[key];

    if (!translations) {
        return key;
    }

    let language = languageOrKey;

    while (true) {
        let msg = translations[language];

        if (msg) {
            return msg;
        }

        if (language === "") {
            return key;
        }

        let index = language.indexOf("-");

        if (index >= 0) {
            language = language.substring(0, index);
        }
        else {
            language = "";
        }
    }
}
