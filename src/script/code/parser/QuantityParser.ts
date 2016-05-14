
import {Scanner} from "./Scanner";
import {Token, QuantityTokenizer} from "./QuantityTokenizer";

import {Quantity} from "./../Quantity";
import {Unit} from "./../Unit";

import * as Units from "./../Units";
import * as Utils from "./../Utils";

import {msg} from "./../../Msg";

export class QuantityParser {

    private tokenizer: QuantityTokenizer;

    constructor(private language: string, source: Scanner | string) {
        let decimalSeparators = msg(language, "Global.decimalSeparators");
        let digitSeparators = msg(language, "Global.digitSeparators");

        this.tokenizer = new QuantityTokenizer(source).decimalSeparators(decimalSeparators).digitSeparators(digitSeparators);

        this.tokenizer.next();
    }

    isSignedQuantity(token: Token): boolean {
        if (this.isUnaryOperator(token)) {
            return true;
        }

        return this.isQuantity(token);
    }

    /**
     *  SignedQuantity = [ "+" | "-" ] Quantity. 
     */
    parseSignedQuantity(): Quantity {
        let token = this.tokenizer.get();

        if (!this.isSignedQuantity(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected signed quantity, but found: ${token.s}`));
        }

        let negative = false;

        if (this.isUnaryOperator(token)) {
            if (token.s === "-") {
                negative = true;
            }

            token = this.tokenizer.next();
        }

        let quantity = this.parseQuantity();

        if (negative) {
            quantity = quantity.negate();
        }

        return quantity;
    }

    isQuantity(token: Token): boolean {
        if (this.isNumber(token)) {
            return true;
        }

        return false;
    }

    /**
     *  Quantity = Number { Unit [ Quantity ] }. 
     */
    parseQuantity(): Quantity {
        let token = this.tokenizer.get();

        if (!this.isQuantity(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected quantity, but found: ${token.s}`));
        }

        let value = this.parseNumber();

        token = this.tokenizer.get();

        if (!this.isUnit(token)) {
            return new Quantity(value);
        }

        let unit = this.parseUnit();
        let quantity = new Quantity(value, unit);

        token = this.tokenizer.get();

        if (this.isQuantity(token)) {
            let otherQuantity = this.parseQuantity();

            quantity = quantity.chain(otherQuantity);
        }

        return quantity;
    }

    isNumber(token: Token): boolean {
        return token.type === "number";
    }

    /**
     * Number = number.
     */
    parseNumber(): number {
        let token = this.tokenizer.get();

        if (!this.isNumber(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
        }

        this.tokenizer.next();

        return token.n;
    }

    isUnit(token: Token): boolean {
        return Units.exists(token.s);
    }

    /**
     * Unit = unit { [ superscript-number | "^" number ] [ ( "*" | "/" ) unit ] }.
     */
    parseUnit(): Unit {
        let startToken = this.tokenizer.get();

        if (!this.isUnit(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected unit, but found: ${startToken.s}`));
        }

        let unitString = startToken.s;
        let token = this.tokenizer.next();

        while (true) {
            if (this.isSuperscriptNumber(token)) {
                unitString += token.s;

                token = this.tokenizer.next();
            }
            else if (this.isOperator(token, "^")) {
                unitString += token.s;

                token = this.tokenizer.next();

                if (!this.isNumber(token)) {
                    throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
                }

                unitString += token.s;

                token = this.tokenizer.next();
            }

            if ((this.isOperator(token, "*\u22c5/")) && (this.isUnit(this.tokenizer.lookAhead()))) {
                unitString += token.s;

                token = this.tokenizer.next();

                unitString += token.s;

                token = this.tokenizer.next();

                continue;
            }

            if (this.isUnit(token)) {
                unitString += " " + token.s;

                token = this.tokenizer.next();

                continue;
            }

            break;
        }

        let unit = Units.get(unitString);

        if (!unit) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Unit not defined: ${unitString}`));
        }

        return unit;
    }

    isSuperscriptNumber(token: Token): boolean {
        return token.type === "superscript-number";
    }

    /**
     * SuperscriptNumber = superscript-number.
     */
    parseSuperscriptNumber(): number {
        let token = this.tokenizer.get();

        if (!this.isNumber(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected superscript number, but found: ${token.s}`));
        }

        this.tokenizer.next();

        return token.n;
    }

    isUnaryOperator(token: Token, allowedOperators?: string): boolean {
        return (token.type === "unary-operator") && ((!allowedOperators) || (allowedOperators.indexOf(token.s) >= 0));
    }

    isOperator(token: Token, allowedOperators?: string): boolean {
        return (token.type === "operator") && ((!allowedOperators) || (allowedOperators.indexOf(token.s) >= 0));
    }

    isEnd(token: Token): boolean {
        return token.type === "end";
    }

}