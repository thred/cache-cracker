import {Scanner} from "./Scanner";

import * as Utils from "./../Utils";
import * as Verify from "./../Verify";

const DEFAULT_WHITESPACES: string = " \n\r\t\b\f\u00a0";
const DEFAULT_ADDITIONAL_LETTERS: string = Verify.ADDITIONAL_LETTERS;
const DEFAULT_UNARY_OPERATORS: string = "+-";
const DEFAULT_UNARY_SUPERSCRIPT_OPERATORS: string = "\u207a\u207b";
const DEFAULT_DECIMAL_SEPARATORS: string = ".";
const DEFAULT_DIGIT_SEPARATORS: string = " \u00a0";
const DEFAULT_ADDITIONAL_IDENTIFIERS: string = Verify.ADDITIONAL_IDENTIFIERS;

const SUPERSCRIPT_DIGITS: string = "\u2070\u2071\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079";

export abstract class AbstractTokenizer<AnyToken extends { n?: number, s: string }> {

    protected scanner: Scanner;
    protected token: AnyToken;
    protected nextToken: AnyToken;

    private _whitespaces: string = DEFAULT_WHITESPACES;
    private _additionalLetters: string = DEFAULT_ADDITIONAL_LETTERS;
    private _unaryOperators: string = DEFAULT_UNARY_OPERATORS;
    private _unarySuperscriptOperators: string = DEFAULT_UNARY_SUPERSCRIPT_OPERATORS;
    private _decimalSeparators: string = DEFAULT_DECIMAL_SEPARATORS;
    private _digitSeparators: string = DEFAULT_DIGIT_SEPARATORS;
    private _additionalIdentifiers: string = DEFAULT_ADDITIONAL_IDENTIFIERS;

    constructor(source: Scanner | string) {
        this.scanner = Scanner.of(source);
    }

    get(): AnyToken {
        if (!this.token) {
            throw new Error("Not initialized");
        }

        return this.token;
    }

    next(): AnyToken {

        if (this.nextToken) {
            this.token = this.nextToken;
            this.nextToken = null;
        }
        else {
            this.token = this.read();
        }

        return this.token;
    }

    lookAhead(): AnyToken {
        if (!this.nextToken) {
            this.nextToken = this.read();
        }

        return this.nextToken;
    }

    protected abstract read(): AnyToken;

    protected isSignedNumber(ch: string, integerOnly: boolean = false): boolean {
        return (this.isUnaryOperator(ch)) || (this.isNumber(ch, integerOnly));
    }

    protected readSignedNumber(token: AnyToken, integerOnly: boolean = false): void {
        let ch = this.scanner.get();

        if (!this.isSignedNumber(ch)) {
            throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Expected signed number, but found: ${ch}`));
        }

        let unaryOperator: string;

        if (this.isUnaryOperator(ch)) {
            unaryOperator = ch;

            ch = this.scanner.next();
        }

        this.readNumber(token, integerOnly);

        if (unaryOperator) {
            token.s = unaryOperator + token.s;

            switch (unaryOperator) {
                case "+":
                    break;

                case "-":
                    token.n = -token.n;
                    break;

                default:
                    throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Invalid unary operator: ${unaryOperator}`));
            }
        }
    }

    protected isNumber(ch: string, integerOnly: boolean = false): boolean {
        return (this.isDigit(ch)) || ((!integerOnly) && (this.isDecimalSeparator(ch)));
    }

    protected readNumber(token: AnyToken, integerOnly: boolean = false): void {
        let ch = this.scanner.get();

        if (!this.isNumber(ch)) {
            throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Expected number, but found: ${ch}`));
        }

        let line = this.scanner.line;
        let column = this.scanner.column;

        let foundDecimalSeparator = false;
        let digitSeparatorCount = 0;

        token.s = "";

        while (true) {
            if (!ch) {
                break;
            }

            if ((this.isDigitSeparator(ch)) && (this.isDigit(this.scanner.lookAhead()))) {
                if (digitSeparatorCount > 0) {
                    break;
                }

                digitSeparatorCount++;

                ch = this.scanner.next();

                continue;
            }

            digitSeparatorCount = 0;

            if ((!integerOnly) && (this.isDecimalSeparator(ch))) {
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

        try {
            token.n = parseFloat(token.s);
        }
        catch (error) {
            throw new Error(Utils.formatError(line, column, `Failed to parse number: ${token.s}`));
        }
    }

    protected isSignedSuperscriptNumber(ch: string): boolean {
        return (this.isUnarySuperscriptOperator(ch)) || (this.isSuperscriptNumber(ch));
    }

    protected readSignedSuperscriptNumber(token: AnyToken): void {
        let ch = this.scanner.get();

        if (!this.isSignedSuperscriptNumber(ch)) {
            throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Expected signed superscript number, but found: ${ch}`));
        }

        let unaryOperator: string;

        if (this.isUnaryOperator(ch)) {
            unaryOperator = ch;

            ch = this.scanner.next();
        }

        this.readSuperscriptNumber(token);

        if (unaryOperator) {
            token.s = unaryOperator + token.s;

            switch (unaryOperator) {
                case "\u207a": // +
                    break;

                case "\u207b": // -
                    token.n = -token.n;
                    break;

                default:
                    throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Invalid unary operator: ${unaryOperator}`));
            }
        }
    }

    protected isSuperscriptNumber(ch: string): boolean {
        return this.isSuperscriptDigit(ch);
    }

    protected readSuperscriptNumber(token: AnyToken): void {
        let ch = this.scanner.get();

        if (!this.isSuperscriptNumber(ch)) {
            throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Expected superscript number, but found: ${ch}`));
        }

        let line = this.scanner.line;
        let column = this.scanner.column;

        token.s = "";

        let s = "";

        while (true) {
            if (!ch) {
                break;
            }

            if (!this.isSuperscriptDigit(ch)) {
                break;
            }

            switch (ch) {
                case "\u2070":
                    s += "0";
                    break;

                case "\u2071":
                case "\u00b9":
                    s += "1";
                    break;

                case "\u00b2":
                    s += "2";
                    break;

                case "\u00b3":
                    s += "3";
                    break;

                case "\u2074":
                    s += "4";
                    break;

                case "\u2075":
                    s += "5";
                    break;

                case "\u2076":
                    s += "6";
                    break;

                case "\u2077":
                    s += "7";
                    break;

                case "\u2078":
                    s += "8";
                    break;

                case "\u2079":
                    s += "9";
                    break;

                default:
                    throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Expected superscript number, but found: ${ch}`));
            }

            token.s += ch;

            ch = this.scanner.next();
        }

        try {
            token.n = parseFloat(s);
        }
        catch (error) {
            throw new Error(Utils.formatError(line, column, `Failed to parse number: ${token.s}`));
        }
    }

    isIdentifier(ch: string): boolean {
        return (this.isLetter(ch)) || (this.isDigit(ch)) || (this._additionalIdentifiers.indexOf(ch) >= 0);
    }

    protected readIdentifier(token: AnyToken): void {
        let ch = this.scanner.get();

        if (!this.isIdentifier(ch)) {
            throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Expected identifier, but found: ${ch}`));
        }

        token.n = null;
        token.s = "";

        while (true) {
            if (!ch) {
                break;
            }

            token.s += ch;

            ch = this.scanner.next();

            if (!this.isIdentifier(ch)) {
                break;
            }
        }
    }

    protected readCharacter(token: AnyToken): void {
        let ch = this.scanner.get();

        if (ch === "\\") {
            ch = this.scanner.next();

            if (!ch) {
                // throw `[Ln ${line}, Col ${column}] Unclosed string`;

                token.s += "\\";

                return;
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

                case "u":
                    ch = this.scanner.next();

                    let s = "";
                    let i = 0;

                    while ((this.isHexDigit(ch)) && (i < 4)) {
                        s += ch;

                        ch = this.scanner.next();
                        i++;
                    }

                    if (i < 4) {
                        token.s += "\\u" + s;
                    }
                    else {
                        token.s += String.fromCharCode(parseInt(s, 16));
                    }
                    break;
                    
                default:
                    token.s += ch;
                    break;
            }

            this.scanner.next();

            return;
        }

        token.s += ch;

        this.scanner.next();
    }

    whitespaces(whitespaces: string): this {
        this._whitespaces = whitespaces;

        return this;
    }

    isWhitespace(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._whitespaces.indexOf(ch) >= 0;
    }

    additionalLetters(additionalLetters: string): this {
        this._additionalLetters = additionalLetters;

        return this;
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

        return this._additionalLetters.indexOf(ch) >= 0;
    }

    isDigit(ch: string): boolean {
        if (!ch) {
            return false;
        }

        let code = ch.charCodeAt(0)

        return ((code >= 48) && (code <= 57));
    }

    isHexDigit(ch: string): boolean {
        if (!ch) {
            return false;
        }

        let code = ch.charCodeAt(0)

        return ((code >= 48) && (code <= 57)) || ((code >= 65) && (code <= 70)) || ((code >= 97) && (code <= 102));
    }

    isSuperscriptDigit(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return SUPERSCRIPT_DIGITS.indexOf(ch) >= 0;
    }

    unaryOperators(unaryOperators: string): this {
        this._unaryOperators = unaryOperators;

        return this;
    }

    isUnaryOperator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._unaryOperators.indexOf(ch) >= 0;
    }

    unarySuperscriptOperators(unarySuperscriptOperators: string): this {
        this._unarySuperscriptOperators = unarySuperscriptOperators;

        return this;
    }

    isUnarySuperscriptOperator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._unarySuperscriptOperators.indexOf(ch) >= 0;
    }

    /**
     * Defines a string with all decimal separators
     * 
     * @param decimalSeparators a string with all decimalSeparators
     */
    decimalSeparators(decimalSeparators: string): this {
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
    digitSeparators(digitSeparators: string): this {
        this._digitSeparators = digitSeparators;

        return this;
    }

    isDigitSeparator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._digitSeparators.indexOf(ch) >= 0;
    }

}

