
import {Scanner} from "./Scanner";
import {Token, CharacterValueRuleTokenizer} from "./CharacterValueRuleTokenizer";

import {Quantity} from "./../Quantity";
import {Unit} from "./../Unit";
import {msg} from "./../Msg";

import * as Globals from "./../Globals";
import * as Units from "./../Units";
import * as Utils from "./../Utils";

export class CharacterValueRuleParser {

    private tokenizer: CharacterValueRuleTokenizer;

    constructor(private language: string, source: Scanner | string, private lowerCaseOnly: boolean = true) {
        let decimalSeparators = msg(language, Globals.DECIMAL_SEPARATOR);
        let digitSeparators = msg(language, Globals.DIGIT_SEPARATORS);
        let expressionSeparators = msg(language, Globals.EXPRESSION_SEPARATOR);

        this.tokenizer = new CharacterValueRuleTokenizer(source).decimalSeparators(decimalSeparators).digitSeparators(digitSeparators).expressionSeparators(expressionSeparators);

        this.tokenizer.next();
    }

    parse(): { [character: string]: number } {
        let context: { [character: string]: number } = {};

        this.parseRules(context);

        let token = this.tokenizer.get();

        if (!this.isEnd(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end, but found: ${token.s}`));
        }

        return context;
    }

    isRules(token: Token): boolean {
        return this.isRule(token);
    }

    /**
     *  Rules = Rule { separator Rule }. 
     */
    parseRules(context: { [character: string]: number }): void {
        let token = this.tokenizer.get();

        if (!this.isRule(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected rule, but found: ${token.s}`));
        }

        this.parseRule(context);

        token = this.tokenizer.get();

        while (this.isSeparator(token)) {
            token = this.tokenizer.next();

            this.parseRule(context);

            token = this.tokenizer.get();
        }
    }

    isRule(token: Token): boolean {
        return this.isCharacter(token);
    }

    /**
     *  Rule = character assignment number [ ellipsis character [ assignment number ] ]. 
     */
    parseRule(context: { [character: string]: number }): void {
        let token = this.tokenizer.get();

        if (!this.isCharacter(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected character, but found: ${token.s}`));
        }

        let ch = token.s;

        if (this.lowerCaseOnly) {
            ch = ch.toLowerCase();
        }

        let code = ch.charCodeAt(0);

        token = this.tokenizer.next();

        if (!this.isAssignment(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected assignment, but found: ${token.s}`));
        }

        token = this.tokenizer.next();

        if (!this.isNumber(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
        }

        let n = token.n;

        token = this.tokenizer.next();

        if (!this.isEllipsis(token)) {
            context[ch] = n;

            return;
        }

        token = this.tokenizer.next();

        if (!this.isCharacter(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected character, but found: ${token.s}`));
        }

        let otherCh = token.s;

        if (this.lowerCaseOnly) {
            otherCh = otherCh.toLowerCase();
        }

        let otherCode = otherCh.charCodeAt(0);
        let codeDistance = otherCode - code;

        token = this.tokenizer.next();

        let otherN: number;

        if (!this.isAssignment(token)) {
            otherN = n + codeDistance;
        }
        else {
            token = this.tokenizer.next();

            if (!this.isNumber(token)) {
                throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
            }

            otherN = token.n;

            token = this.tokenizer.next();
        }

        let nDistance = otherN - n;

        for (let i = 0; i <= Math.abs(codeDistance); i++) {
            context[String.fromCharCode(Math.round(code + (codeDistance * i / Math.abs(codeDistance))))] = n + (nDistance * i / Math.abs(codeDistance));
        }
    }

    isCharacter(token: Token): boolean {
        return token.type === "character";
    }

    isAssignment(token: Token): boolean {
        return token.type === "assignment";
    }

    isNumber(token: Token): boolean {
        return token.type === "number";
    }

    isEllipsis(token: Token): boolean {
        return token.type === "ellipsis";
    }

    isSeparator(token: Token): boolean {
        return token.type === "separator";
    }

    isEnd(token: Token): boolean {
        return token.type === "end";
    }

}