import {Context} from "./Context";
import {Scanner} from "./Scanner";
import {Token, Tokenizer} from "./Tokenizer";

import * as Utils from "./Utils";

import {Quantity} from "./../Quantity";
import {Unit} from "./../Unit";

import * as Units from "./../Units";

import {Command} from "./../command/Command";
import {AccessCommand} from "./../command/AccessCommand";
import {ArrayCommand} from "./../command/ArrayCommand";
import {BinaryOperationCommand} from "./../command/BinaryOperationCommand";
import {CallCommand} from "./../command/CallCommand";
import {ChainOperationCommand} from "./../command/ChainOperationCommand";
import {ConvertCommand} from "./../command/ConvertCommand";
import {IdentifierCommand} from "./../command/IdentifierCommand";
import {MapCommand} from "./../command/MapCommand";
import {QuantityCommand} from "./../command/QuantityCommand";
import {ReferenceCommand} from "./../command/ReferenceCommand";
import {StringCommand, StringCommandReferenceSegment, StringCommandPlaceholderSegment, StringCommandStringSegment} from "./../command/StringCommand";
import {TupleCommand} from "./../command/TupleCommand";
import {UnaryOperationCommand} from "./../command/UnaryOperationCommand";
import {UnitCommand} from "./../command/UnitCommand";

import {Parameter} from "./../definition/Parameter";
import {Procedure} from "./../definition/Procedure";
import {Variable} from "./../definition/Variable";

import {msg} from "./../../Msg";

enum Precedence {
    Undefined,
    Assignment,
    // Conditional,
    // LogicalOr,
    // LogicalAnd,
    // BitwiseOr,
    // BitwiseXOr,
    // BitweiseAnd,
    // Equality,
    // Compare,
    // Shift,
    Addition,
    Multiplication,
    Power,
    // Unary,
    // Unit,
    // Call,
    // Access,
    // Group
}

export class CommandParser {

    private tokenizer: Tokenizer;

    constructor(scanner: Scanner) {
        this.tokenizer = new Tokenizer(scanner);

        this.tokenizer.nextExpressionToken();
    }

    isStatement(context: Context, token: Token): boolean {
        return (this.isUnaryOperator(context, token)) || (this.isExpressionChain(context, token));
    }

    /**
     *  Statement = [ UnaryOperator ] ExpressionChain { Operator [ Statement ] }. 
     */
    parseStatement(context: Context, minimumPrecedence: Precedence = Precedence.Undefined, leadingUnit?: Unit): Command {
        let token = this.tokenizer.get();

        if (!this.isStatement(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected statement, but found: ${token.s}`));
        }

        let expression: Command;

        if (this.isUnaryOperator(context, token)) {
            this.tokenizer.nextExpressionToken();

            let arg = this.parseExpressionChain(context);

            if (token.s === "+") {
                expression = new UnaryOperationCommand(token.line, token.column, "positiveOf", token.s, arg);
            }
            else if (token.s === "-") {
                expression = new UnaryOperationCommand(token.line, token.column, "negativeOf", token.s, arg);
            }
            else {
                throw new Error(Utils.formatError(token.line, token.column, `Unsupported unary operation: ${token.s}`));
            }

            token = this.tokenizer.get();
        }
        else {
            expression = this.parseExpressionChain(context);
        }

        token = this.tokenizer.get();

        while (this.isOperator(context, token)) {
            let name: string;
            let symbol: string = token.s;
            let precedence: Precedence;
            let leftAssociative: boolean = true;

            switch (token.s) {
                case ":=":
                    name = "assign";
                    precedence = Precedence.Assignment;
                    break;

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

            expression = new BinaryOperationCommand(token.line, token.column, name, symbol, expression, this.parseStatement(context, precedence, null));

            token = this.tokenizer.get();
        }

        return expression;
    }

    isExpressionChain(context: Context, token: Token): boolean {
        return this.isExpression(context, token);
    }

    /**
     *  ExpressionChain = Expression [ Unit [ ExpressionChain ] ]. 
     */
    private parseExpressionChain(context: Context, leadingUnit?: Unit): Command {
        let startToken = this.tokenizer.get();

        if (!this.isExpressionChain(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected expression chain, but found: ${startToken.s}`));
        }

        let command = this.parseExpression(context);
        let token = this.tokenizer.get();

        if (this.isUnit(context, token)) {
            let unit = this.parseUnit(context);

            if ((leadingUnit) && (!leadingUnit.isPreceding(unit))) {
                throw new Error(Utils.formatError(token.line, token.column, `Unit ${unit} cannot succeed unit ${leadingUnit} in chained expressions`));
            }

            command = new ConvertCommand(startToken.line, startToken.column, command, unit);

            token = this.tokenizer.get();

            if (this.isExpressionChain(context, token)) {
                command = new ChainOperationCommand(startToken.line, startToken.column, [command, this.parseExpressionChain(context, leadingUnit)]);

                token = this.tokenizer.get();
            }
        }
        else if ((leadingUnit) && (leadingUnit.subUnit)) {
            command = new ConvertCommand(startToken.line, startToken.column, command, leadingUnit.subUnit);
        }

        return command;
    }

    isExpression(context: Context, token: Token): boolean {
        return (this.isTuple(context, token)) || (this.isArray(context, token)) || (this.isMap(context, token)) || (this.isConstant(context, token)) ||
            (this.isReference(context, token)) || (this.isUnit(context, token));
    }

    /**
     *  Expression = Tuple | Array | Map | Constant | Reference | Unit. 
     */
    private parseExpression(context: Context, leadingUnit?: Unit): Command {
        let token = this.tokenizer.get();

        if (!this.isExpression(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected expression, but found: ${token.s}`));
        }

        let result: Command;

        if (this.isTuple(context, token)) {
            result = this.parseTuple(context);
        }
        else if (this.isArray(context, token)) {
            result = this.parseArray(context);
        }
        else if (this.isMap(context, token)) {
            result = this.parseMap(context);
        }
        else if (this.isConstant(context, token)) {
            result = this.parseConstant(context);
        }
        else if (this.isReference(context, token)) {
            result = this.parseReference(context);
        }
        else if (this.isUnit(context, token)) {
            result = new UnitCommand(token.line, token.column, this.parseUnit(context));
        }
        else {
            throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for expression: ${token.s}`));
        }

        return result;
    }

    /**
     * Tuple = "(" [ Statement { "," Statement } ] ")";
     */
    private parseTuple(context: Context): Command {
        let startToken = this.tokenizer.get();
        let commands: Command[] = [];

        if (!this.isTuple(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected tuple, but found: ${startToken.s}`));
        }

        let token = this.tokenizer.nextExpressionToken();

        while (true) {
            if (!this.isStatement(context, token)) {
                break;
            }

            commands.push(this.parseStatement(context));

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ",")) {
                break;
            }

            token = this.tokenizer.nextExpressionToken();
        }

        if (!this.isClosingParentheses(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of tuple, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new TupleCommand(startToken.line, startToken.column, commands);
    }

    /**
     * Array = "[" [ Statement { "," Statement } ] "]";
     */
    private parseArray(context: Context): Command {
        let startToken = this.tokenizer.get();
        let commands: Command[] = [];

        if (!this.isArray(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected array, but found: ${startToken.s}`));
        }

        let token = this.tokenizer.nextExpressionToken();

        while (true) {
            if (!this.isStatement(context, token)) {
                break;
            }

            commands.push(this.parseStatement(context));

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ",")) {
                break;
            }

            token = this.tokenizer.nextExpressionToken();
        }

        if (!this.isClosingArray(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of array, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new ArrayCommand(startToken.line, startToken.column, commands);
    }

    /**
     * Map = "{" Key ":" Statement { "," Key ":" Statement } "}";
     */
    private parseMap(context: Context): Command {
        let startToken = this.tokenizer.get();
        let commands: {
            key: Command;
            value: Command;
        }[] = [];

        if (!this.isMap(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected map, but found: ${startToken.s}`));
        }

        let token = this.tokenizer.nextExpressionToken();

        while (true) {
            if (!this.isKey(context, token)) {
                break;
            }

            let key = this.parseKey(context);

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ":")) {
                throw new Error(Utils.formatError(token.line, token.column, `Expected ":", but found: ${token.s}`));
            }

            token = this.tokenizer.nextExpressionToken();

            let value = this.parseStatement(context);

            commands.push({
                key: key,
                value: value
            });

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ",")) {
                break;
            }

            token = this.tokenizer.nextExpressionToken();

        }

        if (!this.isClosingMap(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of map, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new MapCommand(startToken.line, startToken.column, commands);
    }

    /**
     * Key = String | Identifier. 
     */
    parseKey(context: Context): Command {
        let token = this.tokenizer.get();

        if (!this.isKey(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected key, but found: ${token.s}`));
        }

        if (this.isString(context, token)) {
            return this.parseString(context);
        }

        if (this.isIdentifier(context, token)) {
            return this.parseIdentifier(context);
        }

        throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for key: ${token.s}`));
    }

    /**
     * Constant = Number | String. 
     */
    parseConstant(context: Context): Command {
        let token = this.tokenizer.get();

        if (!this.isConstant(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected constant, but found: ${token.s}`));
        }

        if (this.isNumber(context, token)) {
            return this.parseNumber(context);
        }

        if (this.isString(context, token)) {
            return this.parseString(context);
        }

        throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for constant: ${token.s}`));
    }

    /**
     * Number = number.
     */
    private parseNumber(context: Context): QuantityCommand {
        let token = this.tokenizer.get();

        if (!this.isNumber(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
        }

        this.tokenizer.nextExpressionToken();

        return new QuantityCommand(token.line, token.column, new Quantity(token.n));
    }

    /**
     * String = delimiter { string | reference | ( "${" Expression "}") } delimiter. 
     */
    private parseString(context: Context): StringCommand {
        let startToken = this.tokenizer.get();

        if (!this.isString(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected delimiter, but found: ${startToken.s}`));
        }

        let expressions: Command[] = [];
        let token = this.tokenizer.nextStringToken();

        while (true) {
            if (this.isEnd(context, token)) {
                throw new Error(Utils.formatError(startToken.line, startToken.column, "Unclosed string"));
            }

            if (token.type === "delimiter") {
                token = this.tokenizer.nextExpressionToken();

                break;
            }

            if (token.type === "string") {
                expressions.push(new StringCommandStringSegment(token.line, token.column, token.s));

                token = this.tokenizer.nextStringToken();

                continue;
            }

            if (token.type === "reference") {
                let name = token.s;

                expressions.push(new StringCommandReferenceSegment(token.line, token.column, name))

                token = this.tokenizer.nextStringToken();

                continue;
            }

            if (this.isOpeningPlaceholder(context, token)) {
                let blockToken = this.tokenizer.nextExpressionToken();

                if (this.isEnd(context, blockToken)) {
                    throw new Error(Utils.formatError(token.line, token.column, "Unclosed block"));
                }

                expressions.push(new StringCommandPlaceholderSegment(token.line, token.column, this.parseStatement(context)));

                token = this.tokenizer.get();

                if (!this.isClosingPlaceholder(context, token)) {
                    throw new Error(Utils.formatError(token.line, token.column, `Expected closing placeholder, but found: ${token.s}`));
                }

                token = this.tokenizer.nextStringToken();

                continue;
            }

            throw new Error(Utils.formatError(token.line, token.column, `Expected string content, but found: ${token.s}`));
        }

        return new StringCommand(startToken.line, startToken.column, expressions);
    }

    /**
     * Reference = identifier [ Statement ].
     */
    private parseReference(context: Context): Command {
        let startToken = this.tokenizer.get();

        if (!this.isReference(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected reference, but found: ${startToken.s}`));
        }

        let name = startToken.s;
        let definition = context.get(name);
        let token = this.tokenizer.nextExpressionToken();

        if ((definition === undefined) || (definition === null)) {
            if (this.isAssignment(context, token)) {
                
            }
        }


        if (this.isStatement(context, token)) {
            if (definition instanceof Procedure) {
                let procedure = definition as Procedure;
                let args = this.parseStatement(context);

                return new CallCommand(startToken.line, startToken.column, procedure.createContext(context), procedure, args);
            }

            return new ReferenceCommand(startToken.line, startToken.column, name, definition);
        }


        else if ((definition === undefined) || (definition === null)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Undefined reference: ${name}`));
        }
    }

    /**
     * Call = word Statement.
     */
    private parseCall(context: Context): Command {
        let startToken = this.tokenizer.get();

        if (!this.isCall(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected call, but found: ${startToken.s}`));
        }

        let procedure = context.requiredAsProcedure(startToken.s);

        this.tokenizer.nextExpressionToken();

        let args = this.parseStatement(context);

        return new CallCommand(startToken.line, startToken.column, procedure.createContext(), procedure, args);
    }

    /**
     * Access = word.
     */
    private parseAccess(context: Context): Command {
        let startToken = this.tokenizer.get();

        if (!this.isAccess(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected access, but found: ${startToken.s}`));
        }

        let variable = context.get(startToken.s);

        this.tokenizer.nextExpressionToken();

        return new AccessCommand(startToken.line, startToken.column, variable.name);
    }

    /**
     * Unit = unit { [ "/" ] unit }.
     */
    private parseUnit(context: Context): Unit {
        let startToken = this.tokenizer.get();

        if (!this.isUnit(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected unit, but found: ${startToken.s}`));
        }

        let unitString = startToken.s;
        let token = this.tokenizer.nextExpressionToken();

        while (true) {
            if ((this.isOperator(context, token, "/")) && (this.isUnit(context, this.tokenizer.lookAheadExpressionToken()))) {
                token = this.tokenizer.nextExpressionToken();

                unitString += "/" + token.s;

                token = this.tokenizer.nextExpressionToken();

                continue;
            }

            if (this.isUnit(context, token)) {
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

    /**
     * Identifier = identifier.
     */
    parseIdentifier(context: Context): Command {
        let token = this.tokenizer.get();

        if (!this.isIdentifier(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected identifier, but found: ${token.s}`));
        }

        return new IdentifierCommand(token.line, token.column, token.s);
    }

    isUnaryOperator(context: Context, token: Token): boolean {
        if (!this.isOperator(context, token)) {
            return false;
        }

        return (token.s === "+") || (token.s === "-");
    }

    isAssignment(context: Context, token: Token): boolean {
        return this.isOperator(context, token, ":=");
    }

    isOperator(context: Context, token: Token, operator?: string): boolean {
        if (token.type === "operator") {
            return (!operator) || (operator === token.s);
        }

        return false;
    }

    isOpeningParentheses(context: Context, token: Token) {
        return this.isBrackets(context, token, "(");
    }

    isClosingParentheses(context: Context, token: Token) {
        return this.isBrackets(context, token, ")");
    }

    isOpeningArray(context: Context, token: Token) {
        return this.isBrackets(context, token, "[");
    }

    isClosingArray(context: Context, token: Token) {
        return this.isBrackets(context, token, "]");
    }

    isOpeningMap(context: Context, token: Token) {
        return this.isBrackets(context, token, "{");
    }

    isClosingMap(context: Context, token: Token) {
        return this.isBrackets(context, token, "}");
    }

    isOpeningPlaceholder(context: Context, token: Token) {
        return this.isBrackets(context, token, "${");
    }

    isClosingPlaceholder(context: Context, token: Token) {
        return this.isBrackets(context, token, "}");
    }

    isBrackets(context: Context, token: Token, brackets?: string): boolean {
        return (token.type === "brackets") && ((!brackets) || (brackets === token.s));
    }

    isIdentifier(context: Context, token: Token): boolean {
        if (token.type !== "word") {
            return false;
        }

        return Utils.isIdentifier(token.s);
    }

    isTuple(context: Context, token: Token): boolean {
        return this.isOpeningParentheses(context, token);
    }

    isArray(context: Context, token: Token): boolean {
        return this.isOpeningArray(context, token);
    }

    isMap(context: Context, token: Token): boolean {
        return this.isOpeningMap(context, token);
    }

    isKey(context: Context, token: Token): boolean {
        return (this.isIdentifier(context, token)) || (this.isString(context, token));
    }

    isConstant(context: Context, token: Token): boolean {
        return this.isNumber(context, token) || this.isString(context, token);
    }

    isNumber(context: Context, token: Token): boolean {
        return token.type === "number";
    }

    isString(context: Context, token: Token): boolean {
        return token.type === "delimiter";
    }

    isReference(context: Context, token: Token): boolean {
        return token.type === "word";
    }

    isCall(context: Context, token: Token): boolean {
        if (token.type !== "word") {
            return false;
        }

        return context.isProcedure(token.s);
    }

    isAccess(context: Context, token: Token): boolean {
        if (token.type !== "word") {
            return false;
        }

        return context.isVariable(token.s);
    }

    isUnit(context: Context, token: Token): boolean {
        if ((token.type !== "word") && (token.type !== "delimiter") && (token.type !== "separator") && (token.type !== "operator")) {
            return false;
        }

        return Units.exists(token.s);
    }

    isEnd(context: Context, token: Token): boolean {
        return token.type === "end";
    }

    isSeparator(context: Context, token: Token, separator?: string): boolean {
        return (token.type === "separator") && ((!separator) || (separator === token.s));
    }

}