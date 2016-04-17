let msgs: { [key: string]: { [language: string]: string } } =
    {
        "Sheet.defaultName": {
            "": "My Cache-Picker Sheet",
            "de": "Mein Cache-Picker Zettel"
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
            "de": "Ein Zeiche, Wort oder einen Satz eingeben"
        },

        "Command.Number.title": {
            "": "Enter a Number",
            "de": "Eine Zahl eingeben"
        },

        "Command.Boolean.title": {
            "": "Enter a Logical Value",
            "de": "Einen Wahrheitswert eingeben"
        },

        "Command.category.Input.title": {
            "": "Enter Input",
            "de": "Eingaben"
        }


    };

function getLanguage() {
    return "en-US";
}

export function msg(key: string) {
    let translations = msgs[key];

    if (!translations) {
        return key;
    }

    let language = getLanguage();

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
