import {AbstractTokenizer} from "./AbstractTokenizer";
import {Scanner} from "./Scanner";

import * as Utils from "./../Utils";

const OPERATORS: string = "*\u22c5/^"

export interface Token {
    type: "number" | "superscript-number" | "identifier" | "unary-operator" | "operator" | "end";

    offset: number;

    line: number;

    column: number;

    s: string;

    n: number;
}

export class QuantityTokenizer extends AbstractTokenizer<Token> {

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
            s: "",
            n: null
        };

        if (!ch) {
            token.type = "end";

            return token;
        }

        if (this.isUnaryOperator(ch)) {
            token.type = "unary-operator";
            token.s = ch;

            ch = this.scanner.next();

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

        if (this.isIdentifier(ch)) {
            token.type = "identifier";

            this.readIdentifier(token);

            return token;
        }

        if (this.isOperator(ch)) {
            token.type = "operator";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        throw new Error(Utils.formatError(this.scanner.line, this.scanner.column, `Invalid character: ${ch}`));
    }

    isOperator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return OPERATORS.indexOf(ch) >= 0;
    }

}

