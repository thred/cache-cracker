import {AbstractTokenizer} from "./AbstractTokenizer";
import {Scanner} from "./Scanner";

import * as Utils from "./../Utils";

const DEFAULT_WHITESPACES: string = " \n\r\t\b\f\u00a0";

export interface Token {
    type: "type" | "joker" | "param" | "operator" | "end";

    offset: number;

    line: number;

    column: number;

    s: string;
}

export class TypeTokenizer extends AbstractTokenizer<Token> {

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

        if (this.isIdentifier(ch)) {
            token.type = "type";

            this.readIdentifier(token);

            return token;
        }

        throw new Error(Utils.formatError(token.line, token.column, `Illegal character: ${ch}`));
    }
}
