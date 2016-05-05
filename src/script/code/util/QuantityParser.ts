
import {Scanner} from "./Scanner";
import {Token, Tokenizer} from "./Tokenizer";

import * as Utils from "./Utils";

import {Quantity} from "./../Quantity";
import {Unit} from "./../Unit";

import * as Units from "./../Units";

import {msg} from "./../../Msg";

export class QuantityParser {

    private tokenizer: Tokenizer;

    constructor(private language: string, source: string) {
        let decimalSeparators = msg(language, "Global.decimalSeparators");
        let digitSeparators = msg(language, "Global.digitSeparators");

        this.tokenizer = new Tokenizer(new Scanner(source)).decimalSeparators(decimalSeparators).digitSeparators(digitSeparators);

        this.tokenizer.nextExpressionToken();
    }

    /**
     *  SignedQuantity = [ "+" | "-" ] Quantity. 
     */
    parseSignedQuantity(): Quantity {
        let token = this.tokenizer.get();
        let negative = false;

        if (this.isUnaryOperator(token)) {
            if (token.s === "-") {
                negative = true;
            }

            token = this.tokenizer.nextExpressionToken();
        }

        let quantity = this.parseQuantity();

        if (negative) {
            quantity = quantity.negate();
        }

        return quantity;
    }

    /**
     *  Quantity = Number { Unit [ Quantity ] }. 
     */
    parseQuantity(): Quantity {
        let value = this.parseNumber();
        let token = this.tokenizer.get();

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

    /**
     * Number = number.
     */
    parseNumber(): number {
        let token = this.tokenizer.get();

        if (!this.isNumber(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return token.n;
    }

    /**
     * Unit = unit { [ "/" ] unit }.
     */
    parseUnit(): Unit {
        let startToken = this.tokenizer.get();

        if (!this.isUnit(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected unit, but found: ${startToken.s}`));
        }

        let unitString = startToken.s;
        let token = this.tokenizer.nextExpressionToken();

        while (true) {
            if ((this.isOperator(token, "/")) && (this.isUnit(this.tokenizer.lookAheadExpressionToken()))) {
                token = this.tokenizer.nextExpressionToken();

                unitString += "/" + token.s;

                token = this.tokenizer.nextExpressionToken();

                continue;
            }

            if (this.isUnit(token)) {
                unitString += " " + token.s;

                token = this.tokenizer.nextExpressionToken();

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

    isSignedQuantity(token: Token): boolean {
        if (this.isUnaryOperator(token)) {
            return true;
        }

        return this.isQuantity(token);
    }

    isQuantity(token: Token): boolean {
        if (this.isNumber(token)) {
            return true;
        }

        return false;
    }

    isUnaryOperator(token: Token): boolean {
        if (!this.isOperator(token)) {
            return false;
        }

        return (token.s === "+") || (token.s === "-");
    }

    isOperator(token: Token, operator?: string): boolean {
        if (token.type === "operator") {
            return (!operator) || (operator === token.s);
        }

        return false;
    }

    isNumber(token: Token): boolean {
        return token.type === "number";
    }

    isUnit(token: Token): boolean {
        return Units.exists(token.s);
    }

    isEnd(token: Token): boolean {
        return token.type === "end";
    }

}