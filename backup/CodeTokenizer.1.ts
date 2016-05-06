import Scanner from "./Scanner";

const WHITESPACE: string = " \n\r\t\b\f";
const SYMBOL: string = ",:;()[]{}=+-*/%&|^~!?\\<>";
const DELIMITER: string = WHITESPACE + SYMBOL;

export interface CodeToken {
    type: "string" | "comment" | "symbol" | "identifier" | "eof";

    offset: number;

    line: number;

    column: number;

    value: string;
}

export class CodeTokenizer {

    private scanner: Scanner;
    private token: CodeToken;
    private nextToken: CodeToken;

    constructor(input: string) {
        this.scanner = new Scanner(input);
    }

    private getCharacter() {
        return this.scanner.get();
    }

    private getNonWhitespaceCharacter(): string {
        let ch = this.getCharacter();

        while (isWhitespace(ch)) {
            ch = this.nextCharacter();
        }

        return ch;
    }

    private nextCharacter() {
        return this.scanner.next();
    }

    get(): CodeToken {
        if (!this.token) {
            this.next();
        }

        return this.token;
    }

    next(): CodeToken {
        if (this.nextToken) {
            let next = this.nextToken;

            this.nextToken = null;

            return next;
        }

        let ch = this.getNonWhitespaceCharacter();

        if (!ch) {
            this.token = {
                type: "eof",
                offset: this.scanner.offset,
                line: this.scanner.line,
                column: this.scanner.column,
                value: null
            };
        }
        else if (ch === "\"") {
            this.token = this.readString();
        }
        else if (ch === "\'") {
            this.token = this.readString();
        }
        else if (ch === "\`") {
            this.token = this.readString();
        }
        else if ((ch === "/") && (this.scanner.lookAhead() === "*")) {
            this.token = this.readBlockComment();
        }
        else if ((ch === "/") && (this.scanner.lookAhead() === "/")) {
            this.token = this.readLineComment();
        }
        else if (SYMBOL.indexOf(ch) >= 0) {
            this.token = this.readSymbol();
        }
        else {
            this.token = this.readIdentifier();
        }

        return this.token;
    }

    lookAhead(): CodeToken {
        if (this.nextToken) {
            return this.nextToken;
        }

        this.nextToken = this.next();

        return this.nextToken;
    }

    private readString(): CodeToken {
        let offset = this.scanner.offset;
        let line = this.scanner.line;
        let column = this.scanner.column;
        let delimiter = this.getCharacter();
        let ch = this.nextCharacter();
        let s = "";

        while (true) {
            if (!ch) {
                // throw `[Ln ${line}, Col ${column}] Unclosed string`;
                break;
            }

            if (ch === delimiter) {
                ch = this.nextCharacter();

                break;
            }

            if (ch === "\\") {
                ch = this.nextCharacter();

                if (!ch) {
                    // throw `[Ln ${line}, Col ${column}] Unclosed string`;
                    break;
                }

                switch (ch) {
                    case "n":
                        s += "\n";
                        break;

                    case "r":
                        s += "\r";
                        break;

                    case "t":
                        s += "\t";
                        break;

                    case "\\":
                        s += "\\";
                        break;

                    case "\'":
                        s += "\'";
                        break;

                    case "\"":
                        s += "\"";
                        break;

                    case "\`":
                        s += "\`";
                        break;

                    case "b":
                        s += "\b";
                        break;

                    case "f":
                        s += "\f";
                        break;

                    // TODO add \uxxxx?

                    default:
                        s += ch;
                        break;
                }

                ch = this.nextCharacter();

                continue;
            }

            s += ch;

            ch = this.nextCharacter();
        }

        return {
            type: "string",
            offset: offset,
            line: line,
            column: column,
            value: s
        };
    }

    private readBlockComment(): CodeToken {
        let offset = this.scanner.offset;
        let line = this.scanner.line;
        let column = this.scanner.column;
        let ch = this.nextCharacter();
        let s = "";

        ch = this.nextCharacter();

        while (true) {
            if (!ch) {
                break;
            }

            if ((ch === "*") && (this.scanner.lookAhead() === "/")) {
                ch = this.nextCharacter();
                ch = this.nextCharacter();

                break;
            }

            s += ch;

            ch = this.nextCharacter();
        }

        return {
            type: "comment",
            offset: offset,
            line: line,
            column: column,
            value: s
        };
    }

    private readLineComment(): CodeToken {
        let offset = this.scanner.offset;
        let line = this.scanner.line;
        let column = this.scanner.column;
        let ch = this.nextCharacter();
        let s = "";

        ch = this.nextCharacter();

        while (true) {
            if (!ch) {
                break;
            }

            if (ch === "\n") {
                ch = this.nextCharacter();

                break;
            }

            s += ch;

            ch = this.nextCharacter();
        }

        return {
            type: "comment",
            offset: offset,
            line: line,
            column: column,
            value: s
        };
    }

    private readSymbol(): CodeToken {
        let offset = this.scanner.offset;
        let line = this.scanner.line;
        let column = this.scanner.column;
        let ch = this.getCharacter();
        let s = "";

        s += ch;

        ch = this.nextCharacter();

        return {
            type: "symbol",
            offset: offset,
            line: line,
            column: column,
            value: s
        };
    }

    private readIdentifier(): CodeToken {
        let offset = this.scanner.offset;
        let line = this.scanner.line;
        let column = this.scanner.column;
        let ch = this.getCharacter();
        let s = "";

        while (true) {
            s += ch;

            ch = this.nextCharacter();

            if (!ch) {
                break;
            }

            if (DELIMITER.indexOf(ch) >= 0) {
                break;
            }
        }

        return {
            type: "word",
            offset: offset,
            line: line,
            column: column,
            value: s
        };
    }

}


export function isWhitespace(ch: string): boolean {
    if (!ch) {
        return false;
    }

    return WHITESPACE.indexOf(ch) >= 0;
}



let tz = new CodeTokenizer(`
A = 17;
B = "foobar";


`)

while (true) {
    let t = tz.next();

    if (t.type === "eof") {
        break;
    }

    console.log(t);
}