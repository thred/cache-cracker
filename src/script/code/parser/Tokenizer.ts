import {Scanner} from "./Scanner";

const DEFAULT_WHITESPACES: string = " \n\r\t\b\f\u00a0";
const DEFAULT_OPERATORS: string = "+-*/^"
const DEFAULT_OPERATOR_KEYWORDS: string[] = ["mod"];
const DEFAULT_BRACKETS: string = "(){}[]";
const DEFAULT_DELIMITERS: string = "\"";
const DEFAULT_SEPARATORS: string = ".,:;";
const DEFAULT_DECIMAL_SEPARATORS: string = ".";
const DEFAULT_DIGIT_SEPARATORS: string = " \u00a0";
const DEFAULT_RESERVED_CHARACTERS: string = DEFAULT_WHITESPACES + DEFAULT_OPERATORS + DEFAULT_BRACKETS + DEFAULT_SEPARATORS + "~?\\&|<>!=$#";

export interface Token {
    type: "undefined" | "delimiter" | "string" | "number" | "operator" | "brackets" | "reference" | "comment" | "separator" | "word" | "end";

    offset: number;

    line: number;

    column: number;

    s: string;

    n: number;
}

export class Tokenizer {

    private _whitespaces: string = DEFAULT_WHITESPACES;
    private _operators: string = DEFAULT_OPERATORS;
    private _operatorKeywords: string[] = DEFAULT_OPERATOR_KEYWORDS;
    private _brackets: string = DEFAULT_BRACKETS;
    private _delimiters: string = DEFAULT_DELIMITERS;
    private _separators: string = DEFAULT_SEPARATORS;
    private _decimalSeparators: string = DEFAULT_DECIMAL_SEPARATORS;
    private _digitSeparators: string = DEFAULT_DIGIT_SEPARATORS;
    private _reservedCharacters: string = DEFAULT_RESERVED_CHARACTERS;

    protected scanner: Scanner;
    protected token: Token;
    protected nextToken: Token;

    constructor(source: Scanner | string) {
        this.scanner = Scanner.of(source);
    }

    whitespaces(whitespaces: string): Tokenizer {
        this._whitespaces = whitespaces;

        return this;
    }

    isWhitespace(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._whitespaces.indexOf(ch) >= 0;
    }

    operators(operators: string): Tokenizer {
        this._operators = operators;

        return this;
    }

    isOperator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._operators.indexOf(ch) >= 0;
    }

    operatorKeywords(operatorKeywords: string[]): Tokenizer {
        this._operatorKeywords = operatorKeywords;

        return this;
    }

    isOperatorKeyword(s: string): boolean {
        return this._operatorKeywords.indexOf(s) >= 0;
    }

    brackets(brackets: string): Tokenizer {
        this._brackets = brackets;

        return this;
    }

    isBracket(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._brackets.indexOf(ch) >= 0;
    }

    /**
     * Defines a string with all delimiters, used e.g. for delimiting strings on both ends
     * 
     * @param delimiters a string with all delimiters
     */
    delimiters(delimiters: string): Tokenizer {
        this._delimiters = delimiters;

        return this;
    }

    isDelimiter(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._delimiters.indexOf(ch) >= 0;
    }

    /**
     * Defines a string with all separators, used e.g. for separating identifiers
     * 
     * @param separators a string with all separators
     */
    separators(separators: string): Tokenizer {
        this._separators = separators;

        return this;
    }

    isSeparator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._separators.indexOf(ch) >= 0;
    }

    /**
     * Defines a string with all decimal separators
     * 
     * @param decimalSeparators a string with all decimalSeparators
     */
    decimalSeparators(decimalSeparators: string): Tokenizer {
        this._decimalSeparators = decimalSeparators;

        return this;
    }

    isDecimalSeparator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._decimalSeparators.indexOf(ch) >= 0;
    }

    /**
     * Defines a string with all digit separators
     * 
     * @param digitSeparators a string with all digitSeparators
     */
    digitSeparators(digitSeparators: string): Tokenizer {
        this._digitSeparators = digitSeparators;

        return this;
    }

    isDigitSeparator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._digitSeparators.indexOf(ch) >= 0;
    }

    isLetter(ch: string): boolean {
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

    isDigit(ch: string): boolean {
        if (!ch) {
            return false;
        }

        let code = ch.charCodeAt(0)

        return ((code >= 48) && (code <= 57));
    }

    isNumber(ch: string): boolean {
        return (this.isDigit(ch)) || (this.isDecimalSeparator(ch));
    }

    isWord(ch: string): boolean {
        return !this.isReservedCharacter(ch);
    }

    reservedCharacters(reservedCharacters: string): Tokenizer {
        this._reservedCharacters = reservedCharacters;

        return this;
    }

    isReservedCharacter(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._reservedCharacters.indexOf(ch) >= 0;
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

    lookAheadExpressionToken(): Token {
        if (!this.nextToken) {
            this.nextToken = this.readExpressionToken();
        }

        return this.nextToken;
    }

    lookAheadStringToken(): Token {
        if (!this.nextToken) {
            this.nextToken = this.readStringToken();
        }

        return this.nextToken;
    }

    protected readExpressionToken(): Token {
        let ch = this.scanner.get((ch) => !this.isWhitespace(ch))
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

        if ((ch === "/") && (this.scanner.lookAhead() === "*")) {
            this.scanner.next();

            return this.readBlockCommentToken(this.scanner.next(), token);
        }

        if ((ch === "/") && (this.scanner.lookAhead() === "/")) {
            this.scanner.next();

            return this.readLineCommentToken(this.scanner.next(), token);
        }

        if (this.isDelimiter(ch)) {
            token.type = "delimiter";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (this.isNumber(ch)) {
            return this.readNumberToken(ch, token);
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

        if (this.isWord(ch)) {
            return this.readWordToken(ch, token);
        }

        token.type = "undefined";
        token.s = ch;

        this.scanner.next();

        return token;
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

        let foundDecimalSeparator = false;
        let digitSeparatorCount = 0;

        while (true) {
            if (!ch) {
                break;
            }

            if (this.isDigitSeparator(ch)) {
                if (digitSeparatorCount > 0) {
                    break;
                }

                digitSeparatorCount++;

                ch = this.scanner.next();

                continue;
            }

            digitSeparatorCount = 0;

            if (this.isDecimalSeparator(ch)) {
                if (foundDecimalSeparator) {
                    break;
                }

                if (!this.isDigit(this.scanner.lookAhead())) {
                    break;
                }

                foundDecimalSeparator = true;
                token.s += ".";

                ch = this.scanner.next();

                continue;
            }

            if (!this.isDigit(ch)) {
                break;
            }

            token.s += ch;

            ch = this.scanner.next();
        }

        token.n = parseFloat(token.s);

        return token;
    }

    private readWordToken(ch: string, token: Token): Token {
        token.type = "word";

        while (true) {
            if (!ch) {
                break;
            }

            token.s += ch;

            ch = this.scanner.next();

            if (!this.isWord(ch)) {
                break;
            }
        }

        if (this.isOperatorKeyword(token.s)) {
            token.type = "operator";
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
}

