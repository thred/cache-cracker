import {Scanner} from "./Scanner";
import {Token, CommandTokenizer} from "./CommandTokenizer";

import {Command} from "./../Command";
import {Context} from "./../Context";
import {Definition} from "./../Definition";
import {msg} from "./../Msg";
import {Procedure} from "./../Procedure";
import {Quantity} from "./../Quantity";
import {Types} from "./../Type";
import {Unit} from "./../Unit";

import * as Globals from "./../Globals";
import * as Units from "./../Units";
import * as Utils from "./../Utils";
import * as Verify from "./../Verify";

import {AccessCommand} from "./../command/AccessCommand";
import {AssignmentCommand} from "./../command/AssignmentCommand";
import {BinaryOperationCommand} from "./../command/BinaryOperationCommand";
import {CallCommand} from "./../command/CallCommand";
import {ConvertCommand} from "./../command/ConvertCommand";
import {IdentifierCommand} from "./../command/IdentifierCommand";
import {LinkCommand} from "./../command/LinkCommand";
import {ListCommand} from "./../command/ListCommand";
import {MapCommand} from "./../command/MapCommand";
import {QuantityCommand} from "./../command/QuantityCommand";
import {TextCommand, TextCommandReferenceSegment, TextCommandPlaceholderSegment, TextCommandStringSegment} from "./../command/TextCommand";
import {TupleCommand} from "./../command/TupleCommand";
import {UnaryOperationCommand} from "./../command/UnaryOperationCommand";
import {UnitCommand} from "./../command/UnitCommand";


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

    private tokenizer: CommandTokenizer;

    constructor(scanner: Scanner | string) {
        this.tokenizer = new CommandTokenizer(scanner);

        this.tokenizer.next();
    }

    isStatement(context: Context, token: Token): boolean {
        return (this.isOperator(context, token, "+-")) || (this.isExpressionChain(context, token));
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

        if (this.isOperator(context, token, "+-")) {
            this.tokenizer.next();

            let arg = this.parseExpressionChain(context);

            if (token.s === "+") {
                let name = msg(context.accent, Globals.PROCEDURE_NOP);
                let definition = context.required(name, Types.PROCEDURE);

                expression = new UnaryOperationCommand(token.line, token.column, definition.type.toDistinctType().param, name, token.s, arg);
            }
            else if (token.s === "-") {
                let name = msg(context.accent, Globals.PROCEDURE_NEGATE);
                let definition = context.required(name, Types.PROCEDURE);

                expression = new UnaryOperationCommand(token.line, token.column, definition.type.toDistinctType().param, name, token.s, arg);
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
                case "+":
                    name = msg(context.accent, Globals.PROCEDURE_ADD);
                    precedence = Precedence.Addition;
                    break;

                case "-":
                    name = msg(context.accent, Globals.PROCEDURE_SUBTRACT);
                    precedence = Precedence.Addition;
                    break;

                case "*":
                    name = msg(context.accent, Globals.PROCEDURE_MULTIPLY);
                    precedence = Precedence.Multiplication;
                    break;

                case "/":
                    name = msg(context.accent, Globals.PROCEDURE_DIVIDE);
                    precedence = Precedence.Multiplication;
                    break;

                case "^":
                    name = msg(context.accent, Globals.PROCEDURE_EXPONENTIATE);
                    precedence = Precedence.Power;
                    leftAssociative = false;
                    break;

                case "mod":
                    name = msg(context.accent, Globals.PROCEDURE_MODULO);
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

            this.tokenizer.next();

            let definition = context.required(name, Types.PROCEDURE);

            expression = new BinaryOperationCommand(token.line, token.column, definition.type.toDistinctType().param,
                name, symbol, expression, this.parseStatement(context, precedence, null));

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
                command = new LinkCommand(startToken.line, startToken.column, [command, this.parseExpressionChain(context, leadingUnit)]);

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
            (this.isCall(context, token)) || (this.isUnit(context, token));
    }

    /**
     *  Expression = Tuple | Array | Map | Call | Constant | Unit. 
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
        else if (this.isCall(context, token)) {
            result = this.parseCall(context);
        }
        else if (this.isConstant(context, token)) {
            result = this.parseConstant(context);
        }
        else if (this.isUnit(context, token)) {
            result = new UnitCommand(token.line, token.column, this.parseUnit(context));
        }
        else {
            throw new Error(Utils.formatError(token.line, token.column, `Implementation missing for expression: ${token.s}`));
        }

        return result;
    }

    isTuple(context: Context, token: Token): boolean {
        return this.isOpeningParentheses(context, token);
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

        let token = this.tokenizer.next();

        while (true) {
            if (!this.isStatement(context, token)) {
                break;
            }

            commands.push(this.parseStatement(context));

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ",")) {
                break;
            }

            token = this.tokenizer.next();
        }

        if (!this.isClosingParentheses(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of tuple, but found: ${token.s}`));
        }

        this.tokenizer.next();

        return new TupleCommand(startToken.line, startToken.column, commands);
    }

    isArray(context: Context, token: Token): boolean {
        return this.isOpeningArray(context, token);
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

        let token = this.tokenizer.next();

        while (true) {
            if (!this.isStatement(context, token)) {
                break;
            }

            commands.push(this.parseStatement(context));

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ",")) {
                break;
            }

            token = this.tokenizer.next();
        }

        if (!this.isClosingArray(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of array, but found: ${token.s}`));
        }

        this.tokenizer.next();

        return new ListCommand(startToken.line, startToken.column, commands);
    }

    isMap(context: Context, token: Token): boolean {
        return this.isOpeningMap(context, token);
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

        let token = this.tokenizer.next();

        while (true) {
            if (!this.isKey(context, token)) {
                break;
            }

            let key = this.parseKey(context);

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ":")) {
                throw new Error(Utils.formatError(token.line, token.column, `Expected ":", but found: ${token.s}`));
            }

            token = this.tokenizer.next();

            let value = this.parseStatement(context);

            commands.push({
                key: key,
                value: value
            });

            token = this.tokenizer.get();

            if (!this.isSeparator(context, token, ",")) {
                break;
            }

            token = this.tokenizer.next();

        }

        if (!this.isClosingMap(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of map, but found: ${token.s}`));
        }

        this.tokenizer.next();

        return new MapCommand(startToken.line, startToken.column, commands);
    }

    isKey(context: Context, token: Token): boolean {
        return (this.isIdentifier(context, token)) || (this.isString(context, token));
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

    isCall(context: Context, token: Token): boolean {
        return token.type === "identifier";
    }

    /**
     * Call = identifier [ Assignment | Statement ].
     */
    private parseCall(context: Context): Command {
        let startToken = this.tokenizer.get();

        if (!this.isCall(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected call, but found: ${startToken.s}`));
        }

        let name = startToken.s;
        let token = this.tokenizer.next();

        if (this.isAssignment(context, token)) {
            return this.parseAssigment(context, startToken.line, startToken.column, name);
        }

        let definition = context.get(name);

        if ((definition === undefined) || (definition === null)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Undefined call: ${name}`));
        }

        if (Types.PROCEDURE.accepts(definition.type)) {
            let args = this.parseStatement(context);

            return new CallCommand(startToken.line, startToken.column, definition.type.toDistinctType().param, name, args);
        }

        return new AccessCommand(startToken.line, startToken.column, definition.type, name);
    }

    isAssignment(context: Context, token: Token): boolean {
        return this.isOperator(context, token, ":=");
    }

    /**
     * Assignment = ":=" Statement.
     */
    private parseAssigment(context: Context, line: number, column: number, name: string): Command {
        let startToken = this.tokenizer.get();

        if (!this.isAssignment(context, startToken)) {
            throw new Error(Utils.formatError(line, column, `Expected assignment, but found: ${startToken.s}`));
        }

        let token = this.tokenizer.next();
        let definition = context.get(name);
        let command = this.parseStatement(context, Precedence.Assignment);

        if ((definition === undefined) || (definition === null)) {
            definition = Definition.of(name, command.type, "");

            context.register(definition);
        }
        else if (!definition.type.accepts(command.type)) {
            throw new Error(Utils.formatError(line, column, `Incompatible assignment: "${Utils.toScript(context.accent, command.type)}" cannot be assigned to definition of type "${definition.type}"`));
        }

        return new AssignmentCommand(line, column, name, command);
    }

    isConstant(context: Context, token: Token): boolean {
        return this.isNumber(context, token) || this.isString(context, token);
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

    isNumber(context: Context, token: Token): boolean {
        return token.type === "number";
    }

    /**
     * Number = number.
     */
    private parseNumber(context: Context): QuantityCommand {
        let token = this.tokenizer.get();

        if (!this.isNumber(context, token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
        }

        this.tokenizer.next();

        return new QuantityCommand(token.line, token.column, new Quantity(token.n));
    }

    isString(context: Context, token: Token): boolean {
        return token.type === "delimiter";
    }

    /**
     * String = delimiter { string | reference | ( "${" Expression "}") } delimiter. 
     */
    private parseString(context: Context): TextCommand {
        let startToken = this.tokenizer.get();

        if (!this.isString(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected delimiter, but found: ${startToken.s}`));
        }

        let expressions: Command[] = [];
        let token = this.tokenizer.nextOfString();

        while (true) {
            if (this.isEnd(context, token)) {
                throw new Error(Utils.formatError(startToken.line, startToken.column, "Unclosed string"));
            }

            if (token.type === "delimiter") {
                token = this.tokenizer.next();

                break;
            }

            if (token.type === "string") {
                expressions.push(new TextCommandStringSegment(token.line, token.column, token.s));

                token = this.tokenizer.nextOfString();

                continue;
            }

            if (token.type === "reference") {
                let name = token.s;

                expressions.push(new TextCommandReferenceSegment(token.line, token.column, name))

                token = this.tokenizer.nextOfString();

                continue;
            }

            if (this.isOpeningPlaceholder(context, token)) {
                let blockToken = this.tokenizer.next();

                if (this.isEnd(context, blockToken)) {
                    throw new Error(Utils.formatError(token.line, token.column, "Unclosed block"));
                }

                expressions.push(new TextCommandPlaceholderSegment(token.line, token.column, this.parseStatement(context)));

                token = this.tokenizer.get();

                if (!this.isClosingPlaceholder(context, token)) {
                    throw new Error(Utils.formatError(token.line, token.column, `Expected closing placeholder, but found: ${token.s}`));
                }

                token = this.tokenizer.nextOfString();

                continue;
            }

            throw new Error(Utils.formatError(token.line, token.column, `Expected string content, but found: ${token.s}`));
        }

        return new TextCommand(startToken.line, startToken.column, expressions);
    }

    isUnit(context: Context, token: Token): boolean {
        return Units.exists(token.s);
    }

    /**
     * Unit = unit { [ superscript-number | "^" number ] [ ( "*" | "/" ) unit ] }.
     */
    parseUnit(context: Context): Unit {
        let startToken = this.tokenizer.get();

        if (!this.isUnit(context, startToken)) {
            throw new Error(Utils.formatError(startToken.line, startToken.column, `Expected unit, but found: ${startToken.s}`));
        }

        let unitString = startToken.s;
        let token = this.tokenizer.next();

        while (true) {
            if (this.isSuperscriptNumber(token)) {
                unitString += token.s;

                token = this.tokenizer.next();
            }
            else if (this.isOperator(context, token, "^")) {
                unitString += token.s;

                token = this.tokenizer.next();

                if (!this.isNumber(context, token)) {
                    throw new Error(Utils.formatError(token.line, token.column, `Expected number, but found: ${token.s}`));
                }

                unitString += token.s;

                token = this.tokenizer.next();
            }

            if ((this.isOperator(context, token, "*\u22c5/")) && (this.isUnit(context, this.tokenizer.lookAhead()))) {
                unitString += token.s;

                token = this.tokenizer.next();

                unitString += token.s;

                token = this.tokenizer.next();

                continue;
            }

            if (this.isUnit(context, token)) {
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

    isIdentifier(context: Context, token: Token): boolean {
        if (token.type !== "identifier") {
            return false;
        }

        return Verify.isIdentifier(token.s);
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

    isOperator(context: Context, token: Token, allowedOperators?: string): boolean {
        return (token.type === "operator") && ((!allowedOperators) || (allowedOperators.indexOf(token.s) >= 0));
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

    isBrackets(context: Context, token: Token, allowedBrackets?: string): boolean {
        return (token.type === "brackets") && ((!allowedBrackets) || (allowedBrackets.indexOf(token.s) >= 0));
    }

    isEnd(context: Context, token: Token): boolean {
        return token.type === "end";
    }

    isSeparator(context: Context, token: Token, allowedSeparatros?: string): boolean {
        return (token.type === "separator") && ((!allowedSeparatros) || (allowedSeparatros.indexOf(token.s) >= 0));
    }

}