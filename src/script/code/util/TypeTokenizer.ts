import {Scanner} from "./Scanner";

import * as Utils from "./Utils";

const DEFAULT_WHITESPACES: string = " \n\r\t\b\f\u00a0";

export interface Token {
    type: "type" | "joker" | "param" | "operator" | "end";

    offset: number;

    line: number;

    column: number;

    s: string;
}

export class TypeTokenizer {

    protected scanner: Scanner;
    protected token: Token;
    protected nextToken: Token;

    constructor(source: Scanner | string) {
        this.scanner = Scanner.of(source);
    }

    isWhitespace(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return DEFAULT_WHITESPACES.indexOf(ch) >= 0;
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

    get(): Token {
        if (!this.token) {
            throw new Error("Not initialized");
        }

        return this.token;
    }

    next(): Token {
        if (this.nextToken) {
            this.token = this.nextToken;
            this.nextToken = null;
        }
        else {
            this.token = this.read();
        }

        return this.token;
    }

    lookAhead(): Token {
        if (!this.nextToken) {
            this.nextToken = this.read();
        }

        return this.nextToken;
    }

    protected read(): Token {
        let ch = this.scanner.get((ch) => !this.isWhitespace(ch))
        let token: Token = {
            type: null,
            offset: this.scanner.offset,
            line: this.scanner.line,
            column: this.scanner.column,
            s: ""
        };

        if (!ch) {
            token.type = "end";

            return token;
        }

        if ((ch === "<") || (ch === ">")) {
            token.type = "param";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (ch === "|") {
            token.type = "operator";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (ch === "?") {
            token.type = "joker";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (this.isLetter(ch)) {
            token.type = "type";

            do {
                token.s += ch;

                ch = this.scanner.next();
            }
            while (this.isLetter(ch));

            return token;
        }

        throw new Error(Utils.formatError(token.line, token.column, `Illegal character: ${ch}`));

    }
}
