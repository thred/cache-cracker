


export function toEscapedString(s: string): string {
    // FIXME escape this string
    return s;
}

export function required<Any>(value: Any, message?: string): Any {
    if (value !== undefined) {
        return value;
    }

    if (typeof message === "string") {
        throw new Error(message);
    }

    throw new Error("Required value is undefined")
}

export function formatError(line: number, column: number, message: string, cause?: any) {
    let result = `[Ln ${line}, Col ${column}] ${message}`;

    if (cause) {
        result += `\n\tcaused by ${cause}`;
    }

    return result;
}
