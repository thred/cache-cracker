import {Procedure} from "./Procedure";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Type, DistinctType, Types} from "./Type";
import {Unit} from "./Unit";

import * as Utils from "./util/Utils";

export class Definition implements Utils.Descripted {

    static of(name: string, type: Type | string, description: string, initialValue?: any): Definition {
        return new Definition(name, Type.parse(initialValue), description, initialValue);
    }

    static detect(name: string, description: string, initialValue?: any): Definition {
        return new Definition(name, Type.of(initialValue), description, initialValue);
    }

    static any(name: string, description: string, initialValue?: any) {
        return new Definition(name, Types.ANY, description, initialValue);
    }

    static bool(name: string, description: string, initialValue?: boolean) {
        return new Definition(name, Types.BOOL, description, initialValue);
    }

    static list(name: string, description: string, initialValue?: any[]) {
        return new Definition(name, Types.LIST, description, initialValue);
    }

    static map(name: string, description: string, initialValue?: Object) {
        return new Definition(name, Types.MAP, description, initialValue);
    }

    static procedure(name: string, description: string, params: Definition[], result: Definition, impl: (scope: Scope) => any): Definition {
        return new Definition(name, new DistinctType("Procedure", result.type), description, new Procedure(params, result, impl));
    }

    static quantity(name: string, description: string, initialValue?: Quantity) {
        return new Definition(name, Types.QUANTITY, description, initialValue);
    }

    static text(name: string, description: string, initialValue?: string) {
        return new Definition(name, Types.TEXT, description, initialValue);
    }

    static type(name: string, description: string, initialValue?: Type) {
        return new Definition(name, Types.TYPE, description, initialValue);
    }

    static unit(name: string, description: string, initialValue?: Unit) {
        return new Definition(name, Types.UNIT, description, initialValue);
    }

    private _type: Type;

    constructor(private _name: string, type: Type | string, private _description: string, private _initialValue?: any) {
        if (!Utils.isIdentifier(_name)) {
            throw new Error(`Invalid name for definition: ${_name}`);
        }

        this._type = Type.parse(type);

        if (!this._type.acceptsValue(_initialValue)) {
            throw new Error(`Type is not compatible with initial value: ${type} / ${Type.parse(_initialValue)} (of ${_initialValue})`)
        }
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

    get initialValue(): any {
        return this._initialValue;
    }

    describe(language?: string): string {
        let description = this.name;

        if (this.description) {
            description += "\n\n" + this.description;
        }

        return description;
    }

}