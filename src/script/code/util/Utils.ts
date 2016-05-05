import {Quantity} from "./../Quantity"
import {Unit} from "./../Unit"

export let precision = 8;

export let language = "en-US";

export interface Descripted {

    describe(language?: string): string;

}

export function describe(object: any): string {
    if (object === undefined) {
        return "undefined";
    }

    if (object === null) {
        return "null";
    }

    if (typeof object === "boolean") {
        return object.toString();
    }

    if (typeof object === "number") {
        return object.toString();
    }

    if (typeof object === "string") {
        return toEscapedStringWithQuotes(object as string);
    }

    if (Array.isArray(object)) {
        let s = "[";
        let found: boolean = false;

        for (let item of (object as any[])) {
            let value = describe(item);

            if (found) {
                s += ", ";
            }

            s += indent(value);
            found = true;
        }

        s += "]";

        return s;
    }

    let s = "{";
    let found: boolean = false;

    for (let name in object) {
        let value = describe(object[name]);

        if (found) {
            s += ",";
        }

        s += "\n\t" + indent(toKey(name)) + ": " + indent(value);
        found = true;
    }

    if (found) {
        s += "\n";
    }

    s += "}";

    return s;
}

export function round(n: number, accuracy: number): number {
    if (accuracy === 0) {
        return n;
    }

    return Math.round(n / accuracy) * accuracy;
}

export function floor(n: number, accuracy: number): number {
    if (accuracy === 0) {
        return n;
    }

    return Math.floor(n / accuracy) * accuracy;
}

export function ceil(n: number, accuracy: number): number {
    if (accuracy === 0) {
        return n;
    }

    return Math.ceil(n / accuracy) * accuracy;
}

export type Map = { [key: string]: any };

export function isMap(value: any): boolean {
    return ((value !== undefined) && (value !== null) && (typeof value !== "boolean") && (typeof value !== "number") &&
        (typeof value !== "string") && (!Array.isArray(value)) && (!(value instanceof Quantity)) && (!(value instanceof Unit)));
}

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

export function isIdentifier(s: string): boolean {
    if ((s === undefined) || (s === null)) {
        return false;
    }

    if (!s.length) {
        return false;
    }

    for (let i = 0; i < s.length; i++) {
        let ch = s.charAt(i);

        if (isLetter(ch)) {
            continue;
        }

        if ((isDigit(ch)) && (i > 0)) {
            continue;
        }

        if (ch === "_") {
            continue;
        }

        return false;
    }

    return true;
}

export function toKey(s: string): string {
    if ((s === undefined) || (s === null)) {
        return s;
    }

    if (isIdentifier(s)) {
        return s;
    }

    return toEscapedStringWithQuotes(s);
}

export function toEscapedStringWithQuotes(s: string): string {
    if ((s === undefined) || (s === null)) {
        return s;
    }

    return "\"" + toEscapedString(s) + "\"";
}

export function toEscapedString(s: string): string {
    if ((s === undefined) || (s === null)) {
        return s;
    }

    let result: string = "";

    for (let i = 0; i < s.length; i += 1) {
        let ch = s.charAt(i);

        switch (ch) {
            case "\n":
                result += "\\n";
                break;

            case "\r":
                result += "\\r";
                break;

            case "\t":
                result += "\\t";
                break;

            case "\\":
                result += "\\\\";
                break;

            case "\'":
                result += "\\\'";
                break;

            case "\"":
                result += "\\\"";
                break;

            case "\`":
                result += "\\\`";
                break;

            case "\b":
                result += "\\b";
                break;

            case "\f":
                result += "\\f";
                break;

            default:
                let code = ch.charCodeAt(0);

                if ((code < 32) || (code > 127)) {
                    let hex = code.toString(16);

                    while (hex.length < 4) {
                        hex = "0" + hex;
                    }

                    result += "\\u" + hex;
                }
                else {
                    result += ch;
                }
        }
    }

    return result;
}

export function required<Any>(value: Any, message?: string): Any {
    if (value !== undefined) {
        return value;
    }

    if (typeof message === "string") {
        throw new Error(message);
    }

    throw new Error("Required value is not defined")
}

export function formatError(line: number, column: number, message: string, cause?: any) {
    let result = `[Ln ${line}, Col ${column}] ${message}`;

    if (cause) {
        result += `\n\tcaused by ${cause}`;
    }

    return result;
}

export function indent(s: string) {
    if ((s === undefined) || (s === null)) {
        return s;
    }

    return s.replace("\n", "\n\t");
}
