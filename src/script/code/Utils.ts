import {Quantity} from "./Quantity"
import {Unit} from "./Unit"

import * as Verify from "./Verify";

const SUPERSCRIPT_DIGITS: string = "\u2070\u2071\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079"

export type Map = { [key: string]: any };

export interface Scripted {

    toScript(accent: string): string;

}

export let precision = 8;

// export let language = "en-US";

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

export function toScript(accent: string, object: any): string {
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

    if (typeof object["toScript"] === "function") {
        return (object as Scripted).toScript(accent);
    }

    if (Array.isArray(object)) {
        return `[${(object as any[]).map((item) => indent(toScript(accent, item))).join(", ")}]`;
    }

    //return `{${(object as {[key: string]: any}).map((item) => indent(describe(item, language))).join(", ")}]`;

    let map = object as { [key: string]: any };
    let keys = Object.keys(map);

    if (keys.length === 0) {
        return "{}";
    }

    return `{${Object.keys(map).map((key) => `\n\t${toEscapedStringWithQuotes(key)}: ${indent(toScript(accent, map[key]))}`).join("")}\n}`;
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

export function toKey(s: string): string {
    if ((s === undefined) || (s === null)) {
        return s;
    }

    if (Verify.isIdentifier(s)) {
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

export function toSuperscriptNumber(n: number): string {
    if ((n === undefined) || (n === null)) {
        return n.toString();
    }

    let s = n.toFixed(0);
    let result = "";

    for (let i = 0; i < s.length; i++) {
        let code = s.charCodeAt(i);

        if (code === 45) { // -
            s += "\u207b";
        }
        else if ((code >= 48) && (code <= 57)) {
            s += SUPERSCRIPT_DIGITS[code - 48];
        }
        else {
            throw new Error(`Unsupported superscript digit: ${code}`);
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
