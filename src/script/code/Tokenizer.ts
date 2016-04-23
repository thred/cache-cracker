import Scanner from "./Scanner";

const WHITESPACE: string = " \n\r\t\b\f";
const OPERATOR: string = "+-*/"
const BRACKETS: string = "(){}[]";
const SYMBOL: string = ",:;";
const RESERVED: string = "~?\\^&|<>!=";
const DELIMITER: string = WHITESPACE + OPERATOR + BRACKETS + SYMBOL + RESERVED;

export interface Token {
    type: "string-delimiter" | "string" | "number" | "operator" | "brackets" | "reference" | "comment" | "symbol" | "identifier" | "end";

    offset: number;

    line: number;

    column: number;

    s: string;

    n: number;
}

export class Tokenizer {

    protected token: Token;
    protected nextToken: Token;

    constructor(protected scanner: Scanner) {
    }

    get(): Token {
        if (!this.token) {
            throw new Error("Not initialized");
        }

        return this.token;
    }

    nextExpressionToken(): Token {
        if (this.nextToken) {
            this.token = this.nextToken;
            this.nextToken = null;
        }
        else {
            this.token = this.readExpressionToken();
        }

        return this.token;
    }

    nextStringToken(): Token {
        if (this.nextToken) {
            this.token = this.nextToken;
            this.nextToken = null;

            return this.token;
        }

        this.token = this.readStringToken();

        return this.token;
    }

    // lookAhead(): Token {
    //     if (!this.nextToken) {
    //         this.nextToken = this.read();
    //     }

    //     return this.nextToken;
    // }

    protected readExpressionToken(): Token {
        let ch = this.scanner.get(isNonWhitespace)
        let token: Token = {
            type: null,
            offset: this.scanner.offset,
            line: this.scanner.line,
            column: this.scanner.column,
            s: "",
            n: null
        };

        if (!ch) {
            token.type = "end";

            return token;
        }

        if (ch === "\"") {
            token.type = "string-delimiter";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if ((ch === "/") && (this.scanner.lookAhead() === "*")) {
            this.scanner.next();

            return this.readBlockCommentToken(this.scanner.next(), token);
        }

        if ((ch === "/") && (this.scanner.lookAhead() === "/")) {
            this.scanner.next();

            return this.readLineCommentToken(this.scanner.next(), token);
        }

        if ((isNumber(ch)) || (ch === '.')) {
            return this.readNumberToken(ch, token);
        }

        if (OPERATOR.indexOf(ch) >= 0) {
            token.type = "operator";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (BRACKETS.indexOf(ch) >= 0) {
            token.type = "brackets";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (SYMBOL.indexOf(ch) >= 0) {
            token.type = "symbol";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        return this.readIdentifierToken(ch, token);
    }

    private readBlockCommentToken(ch: string, token: Token): Token {
        token.type = "comment";

        while (true) {
            if (!ch) {
                break;
            }

            if ((ch === "*") && (this.scanner.lookAhead() === "/")) {
                this.scanner.next();
                this.scanner.next();

                break;
            }

            token.s += ch;

            ch = this.scanner.next();
        }

        return token;
    }

    private readLineCommentToken(ch: string, token: Token): Token {
        token.type = "comment";

        while (true) {
            if (!ch) {
                break;
            }

            if (ch === "\n") {
                ch = this.scanner.next();

                break;
            }

            token.s += ch;

            ch = this.scanner.next();
        }

        return token;
    }

    private readNumberToken(ch: string, token: Token): Token {
        token.type = "number";

        let decimalSeparator = false;

        while (true) {
            if (!ch) {
                break;
            }

            if (ch === ".") {
                if (decimalSeparator) {
                    break;
                }

                decimalSeparator = true;
                token.s += ch;

                ch = this.scanner.next();

                continue;
            }

            if (!isNumber(ch)) {
                break;
            }

            token.s += ch;

            ch = this.scanner.next();
        }

        token.n = parseFloat(token.s);

        return token;
    }

    private readIdentifierToken(ch: string, token: Token): Token {
        token.type = "identifier";

        while (true) {
            if (!ch) {
                break;
            }

            token.s += ch;

            ch = this.scanner.next();

            if (DELIMITER.indexOf(ch) >= 0) {
                break;
            }
        }

        return token;
    }

    protected readStringToken(): Token {
        let ch = this.scanner.get();
        let token: Token = {
            type: "string",
            offset: this.scanner.offset,
            line: this.scanner.line,
            column: this.scanner.column,
            s: "",
            n: null
        };

        if (!ch) {
            // throw `[Ln ${token.line}, Col ${token.column}] Unclosed string`;
            token.type = "end";

            return token;
        }

        if (ch === "\"") {
            token.type = "string-delimiter";

            return token;
        }

        if (ch === "$") {
            token.s = ch;

            ch = this.scanner.next();

            if (!ch) {
                return token;
            }

            if (ch === "{") {
                token.s += ch;
                token.type = "brackets";
            }
            else {
                token.s = ch;
                token.type = "reference";
            }

            this.scanner.next();

            return token;
        }

        if (ch === "}") {
            token.type = "brackets";
            token.s = ch;

            ch = this.scanner.next();

            return token;
        }

        while (true) {
            if ((!ch) || (ch === "\"") || (ch === "$")) {
                break;
            }

            if (ch === "\\") {
                ch = this.scanner.next();

                if (!ch) {
                    // throw `[Ln ${line}, Col ${column}] Unclosed string`;

                    token.s += "\\";

                    break;
                }

                switch (ch) {
                    case "n":
                        token.s += "\n";
                        break;

                    case "r":
                        token.s += "\r";
                        break;

                    case "t":
                        token.s += "\t";
                        break;

                    case "\\":
                        token.s += "\\";
                        break;

                    case "\'":
                        token.s += "\'";
                        break;

                    case "\"":
                        token.s += "\"";
                        break;

                    case "\`":
                        token.s += "\`";
                        break;

                    case "b":
                        token.s += "\b";
                        break;

                    case "f":
                        token.s += "\f";
                        break;

                    // TODO add \uxxxx?

                    default:
                        token.s += ch;
                        break;
                }

                ch = this.scanner.next();

                continue;
            }

            token.s += ch;

            ch = this.scanner.next();
        }

        return token;
    }
}

export function isNumber(ch: string): boolean {
    if (!ch) {
        return false;
    }

    let code = ch.charCodeAt(0)

    return ((code >= 48) && (code <= 57));
}

export function isNonWhitespace(ch: string): boolean {
    return !isWhitespace(ch);
}

export function isWhitespace(ch: string): boolean {
    if (!ch) {
        return false;
    }

    return WHITESPACE.indexOf(ch) >= 0;
}
