import {Command} from "./Command";
import {Identifier} from "./Identifier";
import {Quantity} from "./Quantity";
import {Scanner} from "./Scanner";
import {Token, Tokenizer} from "./Tokenizer";
import {Unit} from "./Unit";

import * as Commands from "./Commands";
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

export function parseExpression(scanner: Scanner): Command {
    return new Parser(scanner).expression();
}

class Parser {

    private tokenizer: Tokenizer;

    constructor(scanner: Scanner) {
        this.tokenizer = new Tokenizer(scanner);
    }

    expression(): Command {
        this.tokenizer.nextExpressionToken();

        return this.parseStatement();
    }

    quantity(): Command {
        this.tokenizer.nextExpressionToken();

        return this.parseStatement();
    }

    /**
     *  Statement = [ UnaryOperator ] ExpressionChain { Operator [ Statement ] }. 
     */
    private parseStatement(minimumPrecedence: Precedence = Precedence.Undefined, leadingUnit?: Unit): Command {
        let token = this.tokenizer.get();

        if (!this.isStatement(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected statement, but found: ${token.s}`));
        }

        let expression: Command;

        if (this.isUnaryOperator(token)) {
            this.tokenizer.nextExpressionToken();

            let arg = this.parseExpressionChain();

            if (token.s === "+") {
                expression = new Commands.UnaryOperation(token.line, token.column, "positiveOf", token.s, arg);
            }
            else if (token.s === "-") {
                expression = new Commands.UnaryOperation(token.line, token.column, "negativeOf", token.s, arg);
            }
            else {
                throw new Error(Utils.formatError(token.line, token.column, `Unsupported unary operation: ${token.s}`));
            }

            token = this.tokenizer.get();
        }
        else {
            expression = this.parseExpressionChain();
        }

        token = this.tokenizer.get();

        while (this.isOperator(token)) {
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

            expression = new Commands.BinaryOperation(token.line, token.column, name, symbol, expression, this.parseStatement(precedence, null));

            token = this.tokenizer.get();
        }

        return expression;
    }

    /**
     *  ExpressionChain = Expression { Expression }. 
     */
    private parseExpressionChain(): Command {
        let startToken = this.tokenizer.get();

        if (!this.isExpressionChain(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected expression chain, but found: ${startToken.s}`));
        }

        // parse: SingleExpression
        let expression = this.parseExpression();
        let token = this.tokenizer.get();

        if (this.isExpression(token)) {
            let expressions: Command[] = [expression];

            while (this.isExpression(token)) {
                expressions.push(this.parseExpression());

                token = this.tokenizer.get();
            }

            expression = new Commands.Chain(startToken.line, startToken.column, expressions);
        }

        return expression;
    }

    /**
     *  Expression = ( "(" Statement ")" ) | List | Map | Constant | Unit | Identifier. 
     */
    private parseExpression(leadingUnit?: Unit): Command {
        let token = this.tokenizer.get();

        if (!this.isExpression(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected expression, but found: ${token.s}`));
        }

        let result: Command;

        if (this.isOpeningParentheses(token)) {
            this.tokenizer.nextExpressionToken();

            result = new Commands.Parentheses(token.line, token.column, this.parseStatement());

            let closingToken = this.tokenizer.get();

            if (!this.isClosingParentheses(closingToken)) {
                throw new Error(Utils.formatError(closingToken.line, closingToken.column, "Expected closing parentheses, but found: " + closingToken.s));
            }

            this.tokenizer.nextExpressionToken();
        }
        else if (this.isList(token)) {
            result = this.parseList();
        }
        else if (this.isMap(token)) {
            result = this.parseMap();
        }
        else if (this.isConstant(token)) {
            result = this.parseConstant();
        }
        else if (this.isUnit(token)) {
            result = this.parseUnit();
        }
        else if (this.isIdentifier(token)) {
            result = this.parseIdentifier();
        }
        else {
            throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for expression: ${token.s}`));
        }

        return result;
    }

    /**
     * List = "[" Statement { "," Statement } "]";
     */
    private parseList(): Command {
        let startToken = this.tokenizer.get();
        let commands: Command[] = [];

        if (!this.isList(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected list, but found: ${startToken.s}`));
        }

        let token = this.tokenizer.nextExpressionToken();

        while (true) {
            if (!this.isStatement(token)) {
                break;
            }

            commands.push(this.parseStatement());

            token = this.tokenizer.get();

            if (!this.isSeparator(token, ",")) {
                break;
            }

            token = this.tokenizer.nextExpressionToken();
        }

        if (!this.isClosingList(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of list, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new Commands.List(startToken.line, startToken.column, commands);
    }

    /**
     * Map = "{" Key ":" Statement { "," Key ":" Statement } "}";
     */
    private parseMap(): Command {
        let startToken = this.tokenizer.get();
        let commands: {
            key: Command;
            value: Command;
        }[] = [];

        if (!this.isMap(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected map, but found: ${startToken.s}`));
        }

        let token = this.tokenizer.nextExpressionToken();

        while (true) {
            if (!this.isKey(token)) {
                break;
            }

            let key = this.parseKey();

            token = this.tokenizer.get();

            if (!this.isSeparator(token, ":")) {
                throw new Error(Utils.formatError(token.line, token.column, `Expected ":", but found: ${token.s}`));
            }

            token = this.tokenizer.nextExpressionToken();

            let value = this.parseStatement();

            commands.push({
                key: key,
                value: value
            });

            token = this.tokenizer.get();

            if (!this.isSeparator(token, ",")) {
                break;
            }

            token = this.tokenizer.nextExpressionToken();

        }

        if (!this.isClosingMap(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of map, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new Commands.Map(startToken.line, startToken.column, commands);
    }

    /**
     * Key = String | Identifier. 
     */
    parseKey(): Command {
        let token = this.tokenizer.get();

        if (!this.isKey(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected key, but found: ${token.s}`));
        }

        if (this.isString(token)) {
            return this.parseString();
        }

        if (this.isIdentifier(token)) {
            return this.parseIdentifier();
        }

        throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for key: ${token.s}`));
    }

    /**
     * Constant = Number | String. 
     */
    parseConstant(): Command {
        let token = this.tokenizer.get();

        if (!this.isConstant(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected constant, but found: ${token.s}`));
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
     * Number = number.
     */
    private parseNumber(): Commands.Constant {
        let token = this.tokenizer.get();

        if (!this.isNumber(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new Commands.Constant(token.line, token.column, new Quantity(token.n));
    }

    /**
     * String = delimiter { string | reference | ( "${" Expression "}") } delimiter. 
     */
    private parseString(): Commands.StringChain {
        let startToken = this.tokenizer.get();

        if (!this.isString(startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected delimiter, but found: ${startToken.s}`));
        }

        let expressions: Command[] = [];
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
                expressions.push(new Commands.StringStringSegment(token.line, token.column, token.s));

                token = this.tokenizer.nextStringToken();

                continue;
            }

            if (token.type === "reference") {
                let name = token.s;

                expressions.push(new Commands.StringReferenceSegment(token.line, token.column, name))

                token = this.tokenizer.nextStringToken();

                continue;
            }

            if (this.isOpeningPlaceholder(token)) {
                let blockToken = this.tokenizer.nextExpressionToken();

                if (this.isEnd(blockToken)) {
                    throw new Error(Utils.formatError(token.line, token.column, "Unclosed block"));
                }

                expressions.push(new Commands.StringPlaceholderSegment(token.line, token.column, this.parseStatement()));

                token = this.tokenizer.get();

                if (!this.isClosingPlaceholder(token)) {
                    throw new Error(Utils.formatError(token.line, token.column, `Expected closing placeholder, but found: ${token.s}`));
                }

                token = this.tokenizer.nextStringToken();

                continue;
            }

            throw new Error(Utils.formatError(token.line, token.column, `Expected string content, but found: ${token.s}`));
        }

        return new Commands.StringChain(startToken.line, startToken.column, expressions);
    }

    /**
     * Unit = unit { [ "/" ] unit }.
     */
    private parseUnit(): Command {
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

        return new Commands.Constant(startToken.line, startToken.column, unit);
    }

    /**
     * Identifier = identifier.
     */
    parseIdentifier(): Command {
        let token = this.tokenizer.get();

        if (!this.isIdentifier(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected identifier, but found: ${token.s}`));
        }

        return new Commands.Constant(token.line, token.column, new Identifier(token.s));
    }

    isStatement(token: Token): boolean {
        return (this.isUnaryOperator(token)) || (this.isExpressionChain(token));
    }

    isExpressionChain(token: Token): boolean {
        return this.isExpression(token);
    }

    isExpression(token: Token): boolean {
        return (this.isOpeningParentheses(token)) || (this.isConstant(token));
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

    isOpeningList(token: Token) {
        return this.isBrackets(token, "[");
    }

    isClosingList(token: Token) {
        return this.isBrackets(token, "]");
    }

    isOpeningMap(token: Token) {
        return this.isBrackets(token, "{");
    }

    isClosingMap(token: Token) {
        return this.isBrackets(token, "}");
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

    isIdentifier(token: Token): boolean {
        if (token.type !== "word") {
            return false;
        }

        return Utils.isIdentifier(token.s);
    }

    isList(token: Token): boolean {
        return this.isOpeningList(token);
    }

    isMap(token: Token): boolean {
        return this.isOpeningMap(token);
    }

    isKey(token: Token): boolean {
        return (this.isIdentifier(token)) || (this.isString(token));
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
        if ((token.type !== "word") && (token.type !== "delimiter") && (token.type !== "separator") && (token.type !== "operator")) {
            return false;
        }

        return Units.exists(token.s);
    }

    isEnd(token: Token): boolean {
        return token.type === "end";
    }

    isSeparator(token: Token, separator?: string): boolean {
        return (token.type === "separator") && ((!separator) || (separator === token.s));
    }

}