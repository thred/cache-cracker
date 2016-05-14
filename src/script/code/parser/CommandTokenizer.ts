import {AbstractTokenizer} from "./AbstractTokenizer";
import {Scanner} from "./Scanner";

const OPERATORS: string = "+-*/^"
const OPERATOR_KEYWORDS: string[] = ["mod"];
const BRACKETS: string = "(){}[]";
const DELIMITERS: string = "\"";
const SEPARATORS: string = ".,:;";

export interface Token {
    type: "undefined" | "delimiter" | "string" | "number" | "superscript-number" | "operator" | "brackets" | "reference" | "separator" | "identifier" | "end";

    offset: number;

    line: number;

    column: number;

    comment: string;

    s: string;

    n: number;
}

export class CommandTokenizer extends AbstractTokenizer<Token> {

    constructor(source: Scanner | string) {
        super(source);
    }

    protected read(): Token {
        let ch = this.scanner.get((ch) => !this.isWhitespace(ch))
        let token: Token = {
            type: null,
            offset: this.scanner.offset,
            line: this.scanner.line,
            column: this.scanner.column,
            comment: null,
            s: "",
            n: null
        };

        let comment: string = null;

        while (true) {
            if (!ch) {
                token.type = "end";

                return token;
            }

            if ((ch === "/") && (this.scanner.lookAhead() === "*")) {
                this.scanner.next();

                comment = ((!comment) ? "" : comment + "\n") + this.readBlockComment(this.scanner.next());

                continue;
            }

            if ((ch === "/") && (this.scanner.lookAhead() === "/")) {
                this.scanner.next();

                comment = ((!comment) ? "" : comment + "\n") + this.readLineComment(this.scanner.next());

                continue;
            }

            if (this.isDelimiter(ch)) {
                token.type = "delimiter";
                token.s = ch;

                this.scanner.next();

                return token;
            }

            if (this.isNumber(ch)) {
                token.type = "number";

                this.readNumber(token);

                return token;
            }

            if (this.isSignedSuperscriptNumber(ch)) {
                token.type = "superscript-number";

                this.readSignedSuperscriptNumber(token);

                return token;
            }

            if (this.isOperator(ch)) {
                token.type = "operator";
                token.s = ch;

                this.scanner.next();

                return token;
            }

            if ((ch == ":") && (this.scanner.lookAhead() == "=")) {
                token.type = "operator";
                token.s = ch + this.scanner.next();

                this.scanner.next();

                return token;
            }

            if (this.isBracket(ch)) {
                token.type = "brackets";
                token.s = ch;

                this.scanner.next();

                return token;
            }

            if (this.isSeparator(ch)) {
                token.type = "separator";
                token.s = ch;

                this.scanner.next();

                return token;
            }

            if (this.isIdentifier(ch)) {
                return this.readIdentifierToken(ch, token);
            }

            token.type = "undefined";
            token.s = ch;

            this.scanner.next();

            return token;
        }
    }

    protected readBlockComment(ch: string): string {
        let comment = "";

        while (true) {
            if (!ch) {
                break;
            }

            if ((ch === "*") && (this.scanner.lookAhead() === "/")) {
                this.scanner.next();
                this.scanner.next();

                break;
            }

            comment += ch;

            ch = this.scanner.next();
        }

        return comment;
    }

    protected readLineComment(ch: string): string {
        let comment = "";

        while (true) {
            if (!ch) {
                break;
            }

            if (ch === "\n") {
                ch = this.scanner.next();

                break;
            }

            comment += ch;
            ch = this.scanner.next();
        }

        return comment;
    }

    protected readIdentifierToken(ch: string, token: Token): Token {
        token.type = "identifier";

        this.readIdentifier(token);

        if (this.isOperatorKeyword(token.s)) {
            token.type = "operator";
        }

        return token;
    }

    nextOfString(): Token {
        if (this.nextToken) {
            throw new Error("Look ahead already parsed. Reaching this state is a software bug.");
        }

        this.token = this.readString();

        return this.token;
    }

    protected readString(): Token {
        let ch = this.scanner.get();
        let token: Token = {
            type: "string",
            offset: this.scanner.offset,
            line: this.scanner.line,
            column: this.scanner.column,
            comment: null,
            s: "",
            n: null
        };

        if (!ch) {
            // throw `[Ln ${token.line}, Col ${token.column}] Unclosed string`;
            token.type = "end";

            return token;
        }

        if (ch === "\"") {
            token.type = "delimiter";

            this.scanner.next();

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

            this.scanner.next();

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


    isOperator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return OPERATORS.indexOf(ch) >= 0;
    }

    isOperatorKeyword(s: string): boolean {
        return OPERATOR_KEYWORDS.indexOf(s) >= 0;
    }

    isBracket(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return BRACKETS.indexOf(ch) >= 0;
    }

    isDelimiter(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return DELIMITERS.indexOf(ch) >= 0;
    }

    isSeparator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return SEPARATORS.indexOf(ch) >= 0;
    }

}

