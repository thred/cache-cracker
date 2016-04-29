


export function toEscapedString(s: string): string {
    // FIXME escape this string
    return s;
}

export function formatError(line: number, column: number, message: string, cause?: any) {
    let result = `[Ln ${line}, Col ${column}] ${message}`;

    if (cause) {
        result += `\n\tcaused by ${cause}`;
    }

    return result;
}
