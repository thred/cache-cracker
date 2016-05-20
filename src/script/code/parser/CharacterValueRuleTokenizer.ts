import {AbstractTokenizer} from "./AbstractTokenizer";
import {Scanner} from "./Scanner";

import * as Utils from "./../Utils";

const DEFAULT_EXPRESSION_SEPARATORS: string = ",";

export interface Token {
    type: "character" | "number" | "assignment" | "separator" | "ellipsis" | "end";

    offset: number;

    line: number;

    column: number;

    s: string;

    n: number;
}

export class CharacterValueRuleTokenizer extends AbstractTokenizer<Token> {

    private _expressionSeparators: string = DEFAULT_EXPRESSION_SEPARATORS;

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

        if ((ch === ".") && (this.scanner.lookAhead() === ".")) {
            token.type = "ellipsis";
            token.s = "";

            while (ch === ".") {
                token.s += ch;

                ch = this.scanner.next();
            }

            return token;
        }

        if ((ch === "\u2026")) {
            token.type = "ellipsis";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (this.isSignedNumber(ch)) {
            token.type = "number";

            this.readSignedNumber(token);

            return token;
        }

        if (ch === "=") {
            token.type = "assignment";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        if (this.isExpressionSeparator(ch)) {
            token.type = "separator";
            token.s = ch;

            this.scanner.next();

            return token;
        }

        token.type = "character";

        this.readCharacter(token);

        return token;
    }

    /**
     * Defines a string with all expression separators
     * 
     * @param expressionSeparators a string with all expressionSeparators
     */
    expressionSeparators(expressionSeparators: string): this {
        this._expressionSeparators = expressionSeparators;

        return this;
    }

    isExpressionSeparator(ch: string): boolean {
        if (!ch) {
            return false;
        }

        return this._expressionSeparators.indexOf(ch) >= 0;
    }

}

