import {Expression} from "./Expression";
import {Quantity} from "./Quantity";
import {Scanner} from "./Scanner";
import {Token, Tokenizer} from "./Tokenizer";
import {Unit} from "./Unit";

import * as Expressions from "./Expressions";
import * as Operations from "./Operations";
import * as Units from "./Units";
import * as Utils from "./Utils";

import {msg} from "./../Msg";

enum Precedence {
    Undefined,
    Assignment,
    Conditional,
    LogicalOr,
    LogicalAnd,
    BitwiseOr,
    BitwiseXOr,
    BitweiseAnd,
    Equality,
    Compare,
    Shift,
    Addition,
    Multiplication,
    Power,
    Unary,
    Unit,
    Call,
    Access,
    Group
}

export function scan(source: string): Scanner {
    return new Scanner(source);
}

export function parseExpression(scanner: Scanner): Expression {
    return new Parser(scanner).expression();
}

class Parser {

    private tokenizer: Tokenizer;

    constructor(scanner: Scanner) {
        this.tokenizer = new Tokenizer(scanner);
    }

    expression(): Expression {
        this.tokenizer.nextExpressionToken();

        return this.parseExpression();
    }

    quantity(): Expression {
        this.tokenizer.nextExpressionToken();

        return this.parseExpression();
    }

    /**
     *  Expression = SingleExpression { ( Unit [ Expression ] ) | ( Operator [ Expression ] ) }. 
     */
    private parseExpression(minimumPrecedence: Precedence = Precedence.Undefined, leadingUnit?: Unit): Expression {
        let token = this.tokenizer.get();

        if (!this.isExpression(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected expression, but got: ${token.s}`));
        }

        // parse: SingleExpression
        let expression = this.parseSingleExpression();

        token = this.tokenizer.get();

        while (true) {
            if (this.isUnit(token)) {
                if (Precedence.Unit < minimumPrecedence) {
                    break;
                }

                let unit = this.parseUnit();

                if (leadingUnit) {
                    if (!unit.isCompatible(leadingUnit)) {
                        throw new Error(Utils.formatError(token.line, token.column, `Unit "${unit.symbols[0]}" not compatible with unit "${leadingUnit.symbols[0]}"`));
                    }

                    if (!unit.isPreceding(leadingUnit)) {
                        throw new Error(Utils.formatError(token.line, token.column, `Factor of unit "${unit.symbols[0]}" not smaller than factor of leading unit "${leadingUnit.symbols[0]}"`));
                    }
                }

                leadingUnit = null;
                expression = new Expressions.InUnit(token.line, token.column, expression, unit);
                token = this.tokenizer.get();

                if ((!this.isOperator(token)) && (this.isExpression(token))) {
                    expression = new Expressions.Chain(token.line, token.column, expression, this.parseExpression(Precedence.Unit, unit));

                    token = this.tokenizer.get();
                }

                continue;
            }

            if (this.isOperator(token)) {
                let name: string;
                let symbol: string = token.s;
                let precedence: Precedence;
                let leftAssociative: boolean = true;

                switch (token.s) {
                    case "+":
                        name = "add";
                        precedence = Precedence.Addition;
                        break;

                    case "-":
                        name = "subtract";
                        precedence = Precedence.Addition;
                        break;

                    case "*":
                        name = "multiply";
                        precedence = Precedence.Multiplication;
                        break;

                    case "/":
                        name = "divide";
                        precedence = Precedence.Multiplication;
                        break;

                    case "^":
                        name = "power";
                        precedence = Precedence.Power;
                        leftAssociative = false;
                        break;

                    case "mod":
                        name = "modulo";
                        precedence = Precedence.Multiplication;
                        break;

                    default:
                        throw new Error(Utils.formatError(token.line, token.column, `Unsupported operation: ${token.s}`));
                }

                if (precedence < minimumPrecedence) {
                    break;
                }

                if ((precedence == minimumPrecedence) && (leftAssociative)) {
                    break;
                }

                this.tokenizer.nextExpressionToken();

                expression = new Expressions.BinaryOperation(token.line, token.column, name, symbol, expression, this.parseExpression(precedence, null));

                token = this.tokenizer.get();

                continue;
            }

            if ((leadingUnit) && (leadingUnit.subUnit)) {
                expression = new Expressions.InUnit(token.line, token.column, expression, leadingUnit.subUnit);
            }

            break;
        }

        return expression;
    }

    /**
     *  SingleExpression = ( UnaryOperator SingleExpression ) | ( "(" Expression ")" ) | Reference | Call | Constant. 
     */
    private parseSingleExpression(leadingUnit?: Unit): Expression {
        let token = this.tokenizer.get();

        if (!this.isSingleExpression(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected single expression, but got: ${token.s}`));
        }

        let expression: Expression;

        // parse: ( UnaryOperator SingleExpression )
        if (this.isUnaryOperator(token)) {
            this.tokenizer.nextExpressionToken();

            let arg = this.parseSingleExpression();

            if (token.s === "+") {
                expression = new Expressions.UnaryOperation(token.line, token.column, "positiveOf", token.s, arg);
            }
            else if (token.s === "-") {
                expression = new Expressions.UnaryOperation(token.line, token.column, "negativeOf", token.s, arg);
            }
            else {
                throw new Error(Utils.formatError(token.line, token.column, `Unsupported unary operation: ${token.s}`));
            }

            token = this.tokenizer.get();
        }
        // parse: ( "(" Expression ")" )
        else if (this.isOpeningParentheses(token)) {
            this.tokenizer.nextExpressionToken();

            expression = new Expressions.Parentheses(token.line, token.column, this.parseExpression());

            let closingToken = this.tokenizer.get();

            if (!this.isClosingParentheses(closingToken)) {
                throw new Error(Utils.formatError(closingToken.line, closingToken.column, "Expected closing parentheses, but got: " + closingToken.s));
            }

            token = this.tokenizer.nextExpressionToken();
        }
        // parse: Constant
        else if (this.isConstant(token)) {
            expression = this.parseConstant();
            token = this.tokenizer.get();
        }
        else {
            throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for expression: ${token.s}`));
        }

        return expression;
    }

    /**
     * Constant = Number | String. 
     */
    parseConstant(): Expression {
        let token = this.tokenizer.get();

        if (!this.isConstant(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected constant, but got: ${token.s}`));
        }

        if (this.isNumber(token)) {
            return this.parseNumber();
        }

        if (this.isString(token)) {
            return this.parseString();
        }

        throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for constant: ${token.s}`));
    }


    /**
     * Value = number.
     */
    private parseNumber(): Expressions.Constant {
        let token = this.tokenizer.get();

        if (!this.isNumber(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected number, but got: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new Expressions.Constant(token.line, token.column, new Quantity(token.n));
    }

    /**
     * String = string-delimiter { string | reference | ( "${" Expression "}") } string-delimiter. 
     */
    private parseString(): Expressions.StringChain {
        let startToken = this.tokenizer.get();

        if (!this.isString(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected string-delimiter, but got: ${startToken.s}`));
        }

        let expressions: Expression[] = [];
        let token = this.tokenizer.nextStringToken();

        while (true) {
            if (this.isEnd(token)) {
                throw new Error(Utils.formatError(startToken.line, startToken.column, "Unclosed string"));
            }

            if (token.type === "delimiter") {
                token = this.tokenizer.nextExpressionToken();

                break;
            }

            if (token.type === "string") {
                expressions.push(new Expressions.StringStringSegment(token.line, token.column, token.s));

                token = this.tokenizer.nextStringToken();

                continue;
            }

            if (token.type === "reference") {
                let name = token.s;

                expressions.push(new Expressions.StringReferenceSegment(token.line, token.column, name))

                token = this.tokenizer.nextStringToken();

                continue;
            }

            if (this.isOpeningPlaceholder(token)) {
                let blockToken = this.tokenizer.nextExpressionToken();

                if (this.isEnd(blockToken)) {
                    throw new Error(Utils.formatError(token.line, token.column, "Unclosed block"));
                }

                expressions.push(new Expressions.StringPlaceholderSegment(token.line, token.column, this.parseExpression()));

                token = this.tokenizer.get();

                if (!this.isClosingPlaceholder(token)) {
                    throw new Error(Utils.formatError(token.line, token.column, `Expected closing placeholder, but got: ${token.s}`));
                }

                token = this.tokenizer.nextStringToken();

                continue;
            }

            throw new Error(Utils.formatError(token.line, token.column, `Expected string content, but got: ${token.s}`));
        }

        return new Expressions.StringChain(startToken.line, startToken.column, expressions);
    }

    /**
     * Unit = unit { [ "/" ] unit }.
     */
    private parseUnit(): Unit {
        let startToken = this.tokenizer.get();

        if (!this.isUnit(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected unit, but got: ${startToken.s}`));
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

    isExpression(token: Token): boolean {
        return this.isSingleExpression(token);
    }

    isSingleExpression(token: Token): boolean {
        return this.isUnaryOperator(token) || this.isOpeningParentheses(token) || this.isConstant(token);
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

    isOpeningParentheses(token: Token) {
        return this.isBrackets(token, "(");
    }

    isClosingParentheses(token: Token) {
        return this.isBrackets(token, ")");
    }

    isOpeningPlaceholder(token: Token) {
        return this.isBrackets(token, "${");
    }

    isClosingPlaceholder(token: Token) {
        return this.isBrackets(token, "}");
    }

    isBrackets(token: Token, brackets?: string): boolean {
        return (token.type === "brackets") && ((!brackets) || (brackets === token.s));
    }

    isConstant(token: Token): boolean {
        return this.isNumber(token) || this.isString(token);
    }

    isNumber(token: Token): boolean {
        return token.type === "number";
    }

    isString(token: Token): boolean {
        return token.type === "delimiter";
    }

    isUnit(token: Token): boolean {
        if ((token.type !== "identifier") && (token.type !== "delimiter") && (token.type !== "separator") && (token.type !== "operator")) {
            return false;
        }

        return Units.exists(token.s);
    }

    isEnd(token: Token): boolean {
        return token.type === "end";
    }

    isSeparator(token: Token, separator: string): boolean {
        return (token.type === "separator") && (token.s === separator);
    }

}