import {Msg, msg, defMsg} from "./Msg";

const ADDITIONAL_IDENTIFIERS: string = "_§$#"

export function isLetter(ch: string): boolean {
    if (!ch) {
        return false;
    }

    let code = ch.charCodeAt(0)

    if ((code >= 65) && (code <= 90)) {
        return true;
    }

    if ((code >= 97) && (code <= 122)) {
        return true;
    }

    return "ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÞþÐð".indexOf(ch) >= 0;
}

export function isDigit(ch: string): boolean {
    if (!ch) {
        return false;
    }

    let code = ch.charCodeAt(0)

    return ((code >= 48) && (code <= 57));
}

export function isIdent(ch: string): boolean {
    return (isLetter(ch)) || (isDigit(ch)) || (ADDITIONAL_IDENTIFIERS.indexOf(ch) >= 0);
}

export function isIdentifier(msg: Msg): boolean {
    if ((msg === undefined) || (msg === null)) {
        return false;
    }

    if (typeof msg === "string") {
        let s = msg as string;

        if (!s.length) {
            return false;
        }

        for (let i = 0; i < s.length; i++) {
            let ch = s.charAt(i);

            if ((i == 0) && (isDigit(ch))) {
                return false;
            }

            if (!isIdent(ch)) {
                return false;
            }
        }

        return true;
    }

    for (let language in msg as { [language: string]: string }) {
        if (!isIdentifier((msg as { [language: string]: string })[language])) {
            return false;
        }
    }

    return true;
}

