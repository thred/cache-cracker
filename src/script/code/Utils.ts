
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

            s += value.replace("\n", "\n\t");
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

        s += "\n\t" + toIdentifier(name) + ": " + value.replace("\n", "\n\t");
        found = true;
    }

    if (found) {
        s += "\n";
    }

    s += "}";

    return s;
}

export function toIdentifier(s: string): string {
    if ((s === undefined) || (s === null)) {
        return s;
    }

    // TODO implement identifier detection and return without quotes if possible
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
