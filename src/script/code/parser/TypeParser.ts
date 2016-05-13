import {Scanner} from "./Scanner";
import {Token, TypeTokenizer} from "./TypeTokenizer";

import * as Utils from "./../Utils";

import {TypeName, Type, AnyType, DistinctType, OrType, VoidType, Types} from "./../Type";

export class TypeParser {

    private tokenizer: TypeTokenizer;

    constructor(source: Scanner | string) {
        this.tokenizer = new TypeTokenizer(source);

        this.tokenizer.next();
    }

    parse(): Type {
        let type = this.parseType();
        let token = this.tokenizer.next();

        if (!this.isEnd(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected end of source, but found: ${token.s}`));
        }

        return type;
    }

    isType(token: Token): boolean {
        return this.isSingleType(token);
    }

    /**
     * Type = SingleType [ "|" SingleType ].
     */
    parseType(): Type {
        let types: Type[] = [];
        let token = this.tokenizer.get();

        if (!this.isType(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected type, but found: ${token.s}`));
        }

        types.push(this.parseSingleType());

        token = this.tokenizer.get();

        while (this.isOperator(token, "|")) {
            token = this.tokenizer.next();

            types.push(this.parseSingleType());

            token = this.tokenizer.get();
        }

        if (types.length === 1) {
            return types[0];
        }

        return new OrType(types);
    }

    isSingleType(token: Token): boolean {
        return (token.type === "type") || (token.type === "joker");
    }

    /**
     * SingleType = "?" | "Void" | ( Name [ "<" Type ">" ] ).
     */
    parseSingleType(): Type {
        let token = this.tokenizer.get();

        if (!this.isSingleType(token)) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected single type, but found: ${token.s}`));
        }

        if (token.type === "joker") {
            token = this.tokenizer.next();

            return Types.ANY;
        }

        let name = token.s;

        if (name === "Void") {
            token = this.tokenizer.next();

            return Types.VOID;
        }

        let definition = Types.DEFINED[name];

        if (definition === undefined) {
            throw new Error(Utils.formatError(token.line, token.column, `Unsupported type name: ${name}`));
        }

        token = this.tokenizer.next();

        if (!this.isParam(token, "<")) {
            return definition.type;
        }

        if (!definition.hasParams) {
            throw new Error(Utils.formatError(token.line, token.column, `Type does not support parameters: ${name}`));
        }

        let param: Type;

        token = this.tokenizer.next();

        param = this.parseType();

        token = this.tokenizer.get();

        if (!this.isParam(token, ">")) {
            throw new Error(Utils.formatError(token.line, token.column, `Expected ">", but found: ${token.s}`));
        }

        token = this.tokenizer.next();

        if (definition.type.toDistinctType().param.matches(param)) {
            return definition.type;
        }

        return new DistinctType(name as TypeName, param);
    }

    isParam(token: Token, s?: string) {
        return (token.type === "param") && ((!s) || (token.s === s));
    }

    isOperator(token: Token, s?: string) {
        return (token.type === "operator") && ((!s) || (token.s === s));
    }

    isEnd(token: Token): boolean {
        return token.type === "end";
    }

}
