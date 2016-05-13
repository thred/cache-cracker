import {Quantity} from "./Quantity"
import {Unit} from "./Unit"

export type Map = { [key: string]: any };

export interface Descripted {

    describe(language?: string): string;

}

export let precision = 8;

export let language = "en-US";

export function required<Any>(value: Any, message?: string): Any {
    if (value !== undefined) {
        return value;
    }

    if (typeof message === "string") {
        throw new Error(message);
    }

    throw new Error("Required value is not defined")
}

export function requiredNotNull<Any>(value: Any, message?: string): Any {
    if ((value !== undefined) && (value !== null)) {
        return value;
    }

    if (typeof message === "string") {
        throw new Error(message);
    }

    if (value === undefined) {
        throw new Error("Required value is not defined")
    }

    throw new Error("Required value is null")
}

export function describe(object: any, language?: string): string {
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

    if (typeof object["describe"] === "function") {
        return (object as Descripted).describe(language);
    }

    if (Array.isArray(object)) {
        return `[${(object as any[]).map((item) => indent(describe(item, language))).join(", ")}]`;
    }

    //return `{${(object as {[key: string]: any}).map((item) => indent(describe(item, language))).join(", ")}]`;

    let map = object as { [key: string]: any };
    let keys = Object.keys(map);

    if (keys.length === 0) {
        return "{}";
    }

    return `{${Object.keys(map).map((key) => `\n\t${toEscapedStringWithQuotes(key)}: ${indent(describe(map[key], language))}`).join("")}\n}`;
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

export function formatError(line: number, column: number, message: string, cause?: any) {
    let result = `[Ln ${line}, Col ${column}] ${message}`;

    if (cause) {
        result += `\n\tcaused by ${indent(cause.stack.toString())}`;
    }

    return result;
}

export function indent(s: string, t: string = "  ") {
    if ((s === undefined) || (s === null)) {
        return s;
    }

    return s.replace(/\n/g, "\n" + t);
}
