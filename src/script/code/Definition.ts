import {Procedure} from "./Procedure";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Type, DistinctType, Types} from "./Type";
import {Unit} from "./Unit";

import * as Utils from "./util/Utils";

export class Definition implements Utils.Descripted {

    static of(name: string, type: Type | string, description: string, initialValue?: any): Definition {
        return new Definition(name, Type.parse(type), description, (scope: Scope) => initialValue);
    }

    static detect(name: string, description: string, initialValue?: any): Definition {
        return new Definition(name, Type.of(initialValue), description, (scope: Scope) => initialValue);
    }

    static any(name: string, description: string, initialValue?: any) {
        return new Definition(name, Types.ANY, description, (scope: Scope) => initialValue);
    }

    static bool(name: string, description: string, initialValue?: boolean) {
        return new Definition(name, Types.BOOL, description, (scope: Scope) => initialValue);
    }

    static list(name: string, description: string, initialValue?: any[]) {
        return new Definition(name, Types.LIST, description, (scope: Scope) => initialValue);
    }

    static map(name: string, description: string, initialValue?: Object) {
        return new Definition(name, Types.MAP, description, (scope: Scope) => initialValue);
    }

    static procedure(name: string, description: string, params: Definition[], result: Definition, impl: (scope: Scope) => any): Definition {
        result = result || Definition.of("void", Types.VOID, "Nothing");

        return new ProcedureDefinition(name, new DistinctType("Procedure", result.type), description, params, result, impl);
    }

    static quantity(name: string, description: string, initialValue?: Quantity) {
        return new Definition(name, Types.QUANTITY, description, (scope: Scope) => initialValue);
    }

    static text(name: string, description: string, initialValue?: string) {
        return new Definition(name, Types.TEXT, description, (scope: Scope) => initialValue);
    }

    static type(name: string, description: string, initialValue?: Type) {
        return new Definition(name, Types.TYPE, description, (scope: Scope) => initialValue);
    }

    static unit(name: string, description: string, initialValue?: Unit) {
        return new Definition(name, Types.UNIT, description, (scope: Scope) => initialValue);
    }

    private _type: Type;

    constructor(private _name: string, type: Type | string, private _description: string, private _initialValueProvider?: (scope: Scope) => any) {
        if (!Utils.isIdentifier(_name)) {
            throw new Error(`Invalid name for definition: ${_name}`);
        }

        this._type = Type.parse(type);
    }

    get name(): string {
        return this._name;
    }

    get type(): Type {
        return this._type;
    }

    get description(): string {
        return this._description;
    }

    createInitialValue(scope: Scope): any {
        if (!this._initialValueProvider) {
            return undefined;
        }

        let initialValue = this._initialValueProvider(scope);

        if (!this._type.acceptsValue(initialValue)) {
            throw new Error(`Type is not compatible with initial value: ${this._type} / ${Type.parse(initialValue)} (of ${Utils.describe(initialValue)})`);
        }

        return initialValue;
    }

    describe(language?: string): string {
        let description = this.name;

        if (this.description) {
            description += "\n\n" + this.description;
        }

        return description;
    }
}

class ProcedureDefinition extends Definition {

    constructor(name: string, type: Type | string, description: string, private _params: Definition[], private _result: Definition, private _impl?: (scope: Scope) => any) {
        super(name, type, description, (scope: Scope) => {
            return new Procedure(scope, _params, _result, _impl);
        });
    }

}