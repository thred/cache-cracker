export type Msg = string | { [language: string]: string };

export function msg(language: string, message: Msg, ...args: any[]): string {
    if (!message) {
        return null;
    }

    if (typeof message !== "string") {
        let l = language;

        while (true) {
            let s = (message as { [language: string]: string })[l];

            if (s) {
                message = s;
                break;
            }

            if (l === "") {
                throw new Error(`Default message is missing: ${JSON.stringify(message)}`);
            }

            let index = l.indexOf("-");

            if (index >= 0) {
                l = l.substring(0, index);
            }
            else {
                l = "";
            }
        }
    }

    if (args) {
        for (let i = 0; i < args.length; i++) {
            message = (message as string).replace(new RegExp(`\{${i}\}`, "g"), args[i].toString());
        }
    }

    return message as string;
}

export function defMsg(language: string, key: string, ...args: any[]): string {
    let message = defMsgs[key];

    if (!message) {
        return `DefMsg missing: ${key}`;
    }
}

let defMsgs: { [key: string]: { [language: string]: string } } =
    {
        "Definition.describe.param": {
            "": "* Parameter {0}: {1}"
        },

        "Definition.describe.result": {
            "": "* Result: {1}",
            "de": "* Ergebnis: {1}"
        },

    };

function getLanguage() {
    return "en-US";
}

