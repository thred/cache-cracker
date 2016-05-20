import {Msg, msg, defMsg} from "./Msg";
import {Procedure, Parameter} from "./Procedure";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Type, DistinctType, Types} from "./Type";
import {Unit} from "./Unit";

import * as Globals from "./Globals";
import * as Utils from "./Utils";
import * as Verify from "./Verify";

export class Definition implements Utils.Scripted {

    static of(name: Msg, type: Type | string, description: Msg, initialValue?: any): Definition {
        return new Definition(name, Type.parse(type), description, (scope: Scope) => initialValue);
    }

    static detect(name: Msg, description: Msg, initialValue?: any): Definition {
        return new Definition(name, Type.of(initialValue), description, (scope: Scope) => initialValue);
    }

    static any(name: Msg, description: Msg, initialValue?: any) {
        return new Definition(name, Types.ANY, description, (scope: Scope) => initialValue);
    }

    static bool(name: Msg, description: Msg, initialValue?: boolean) {
        return new Definition(name, Types.BOOL, description, (scope: Scope) => initialValue);
    }

    static list(name: Msg, description: Msg, initialValue?: any[]) {
        return new Definition(name, Types.LIST, description, (scope: Scope) => initialValue);
    }

    static map(name: Msg, description: Msg, initialValue?: Object) {
        return new Definition(name, Types.MAP, description, (scope: Scope) => initialValue);
    }

    static procedure(name: Msg, description: Msg, params: Definition[], result: Definition, impl: (scope: Scope) => any): ProcedureDefinition {
        result = result || Definition.of("void", Types.VOID, "Nothing");

        return new ProcedureDefinition(name, new DistinctType("Procedure", result.type), description, params, result, impl);
    }

    static quantity(name: Msg, description: Msg, initialValue?: Quantity) {
        return new Definition(name, Types.QUANTITY, description, (scope: Scope) => initialValue);
    }

    static text(name: Msg, description: Msg, initialValue?: string) {
        return new Definition(name, Types.TEXT, description, (scope: Scope) => initialValue);
    }

    static type(name: Msg, description: Msg, initialValue?: Type) {
        return new Definition(name, Types.TYPE, description, (scope: Scope) => initialValue);
    }

    static unit(name: Msg, description: Msg, initialValue?: Unit) {
        return new Definition(name, Types.UNIT, description, (scope: Scope) => initialValue);
    }

    protected _type: Type;

    constructor(protected _name: Msg, type: Type | string, protected _description: Msg, protected _initialValueProvider?: (scope: Scope) => any) {
        if (!Verify.isIdentifier(_name)) {
            throw new Error(`Invalid identifier: ${Utils.toScript(Globals.DEFAULT_ACCENT, _name)}`);
        }

        this._type = Type.parse(type);
    }

    getName(language: string) {
        return msg(language, this._name);
    }

    // get name(): Msg {
    //     return this._name;
    // }

    get type(): Type {
        return this._type;
    }

    getDescription(language: string) {
        return msg(language, this._description);
    }

    // get description(): Msg {
    //     return this._description;
    // }

    createInitialValue(scope: Scope): any {
        if (!this._initialValueProvider) {
            return undefined;
        }

        let initialValue: any = this._initialValueProvider(scope);

        if (!this._type.acceptsValue(initialValue)) {
            throw new Error(`Type is not compatible with initial value: ${this._type} / ${Type.parse(initialValue)} (of ${Utils.toScript(Globals.DEFAULT_ACCENT, initialValue)})`);
        }

        return initialValue;
    }

    toParameter(accent: string): Parameter {
        return {
            name: msg(accent, this._name),
            type: this._type,
            initialValueProvider: this._initialValueProvider
        };
    }

    toScript(accent: string): string {
        let description: string = msg(accent, this._name);

        if (this._description) {
            description += "\n\n" + msg(accent, this._description);
        }

        return description;
    }
}

export class ProcedureDefinition extends Definition {

    constructor(name: Msg, type: Type | string, description: Msg, protected _params: Definition[], protected _result: Definition, protected _impl?: (scope: Scope) => any) {
        super(name, type, description, (scope: Scope) => {
            return new Procedure(scope, _params.map((param) => param.toParameter(scope.accent)), _result.type, _impl);
        });
    }

    toScript(accent: string): string {
        let description: string = super.toScript(accent);

        if ((this._params) && (this._params.length > 0)) {
            description += "\n\n" + this._params.map((param) => defMsg(accent, "Definition.describe.param", param.getName(accent), param.getDescription(accent))).join("\n");
        }

        if (this._result) {
            description += "\n" + this._params.map((param) => defMsg(accent, "Definition.describe.result", param.getName(accent), param.getDescription(accent))).join("\n");
        }

        return description;
    }
}