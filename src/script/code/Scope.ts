import {Definition} from "./Definition";
import {Procedure} from "./Procedure";
import {Quantity} from "./Quantity";
import {DistinctType, Type, Types} from "./Type";
import {Unit} from "./Unit";

import {Command} from "./command/Command";

import * as Utils from "./util/Utils";

export class Scope {

    private values: { [name: string]: any } = {};

    constructor(private _parent: Scope) {
    }

    derive(params?: { [name: string]: any }): Scope {
        return new Scope(this).put(params);
    }

    get parent(): Scope {
        return this._parent;
    }

    get(name: string, defaultValue?: any): any {
        let value = this.values[name];

        if (value === undefined) {
            let scope: Scope = this;

            while ((value === undefined) && (scope.parent)) {
                scope = scope.parent;
                value = scope.values[name];
            }
        }

        if ((value === undefined) || (value === null)) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }

            return value;
        }

        // if (value instanceof Command) {
        //     value = (value as Command).invoke(this);
        // }

        return value;
    }

    getAs(name: string, type: Type, defaultValue?: any): any {
        return this.as(type, this.get(name, defaultValue));
    }

    getAsBool(name: string, defaultValue?: boolean): boolean {
        return this.getAs(name, Types.BOOL, defaultValue);
    }

    getAsList(name: string, defaultValue?: any[]): any[] {
        return this.getAs(name, Types.LIST, defaultValue);
    }

    getAsMap(name: string, defaultValue?: Object): Object {
        return this.getAs(name, Types.MAP, defaultValue);
    }

    getAsProcedure(name: string, defaultValue?: Procedure): Procedure {
        return this.getAs(name, Types.PROCEDURE, defaultValue);
    }

    getAsQuantity(name: string, defaultValue?: Quantity): Quantity {
        return this.getAs(name, Types.QUANTITY, defaultValue);
    }

    getAsText(name: string, defaultValue?: string): string {
        return this.getAs(name, Types.TEXT, defaultValue);
    }

    getAsType(name: string, defaultValue?: string): string {
        return this.getAs(name, Types.TYPE, defaultValue);
    }

    getAsUnit(name: string, defaultValue?: Unit): Unit {
        return this.getAs(name, Types.UNIT, defaultValue);
    }

    invoke(name: string, arg: any): any {
        let procedure: Procedure = this.requiredAsProcedure(name);
        let params = procedure.params;
        let map: Utils.Map;
        let type: Type = Type.of(arg);

        if ((Types.BOOL.accepts(type)) || (Types.PROCEDURE.accepts(type)) || (Types.QUANTITY.accepts(type)) ||
            (Types.TEXT.accepts(type)) || (Types.TYPE.accepts(type)) || (Types.UNIT.accepts(type))) {

            if (1 > params.length) {
                throw new Error(`Too many arguments in procedure call (${1} > ${params.length}): ${procedure.describe()}`);
            }

            map = {};

            map[params[0].name] = arg;
        }
        else if (Types.LIST.accepts(type)) {
            let list = arg as any[];

            if (list.length > params.length) {
                throw new Error(`Too many arguments in procedure call (${list} > ${params.length}): ${procedure.describe()}`);
            }

            map = {};

            for (let index = 0; index < list.length; index++) {
                map[params[index].name] = list[index];
            }
        }
        else if (Types.MAP.accepts(type)) {
            map = arg as Utils.Map;
        }
        else {
            throw new Error(`Unsupported argument type "${type}" with procedure call: ${procedure.describe()}`);
        }

        let childScope = this.derive();

        for (let param of params) {
            let name = param.name;
            let value = map[name];

            if (value === undefined) {
                if (param.initialValue === undefined) {
                    throw new Error(`Required argument "${name}" is missing in procedure call: ${procedure.describe()}`);
                }

                value = param.initialValue;
            }

            try {
                value = this.as(param.type, value);
            }
            catch (error) {
                throw new Error(`Argument "${name}" cannot be converted to "${param.type}" for procedure call: ${procedure.describe()}.\n\tCaused by ${Utils.indent(error.stack.toString())}`);
            }

            childScope.set(name, value);
        }

        try {
            return procedure.invoke(childScope);
        }
        catch (error) {
            throw new Error(`Invocation failed: ${name}.\n\tcaused by ${Utils.indent(error.stack.toString())}`);
        }
    }

    required(name: string): any {
        return Utils.required(this.get(name), `Required value is not defined: ${name}`);
    }

    requiredAs(name: string, type: Type): any {
        return Utils.required(this.getAs(name, type), `Required ${type} is not defined: ${name}`);
    }

    requiredAsBool(name: string): boolean {
        return this.requiredAs(name, Types.BOOL);
    }

    requiredAsList(name: string): any[] {
        return this.requiredAs(name, Types.LIST);
    }

    requiredAsMap(name: string): Object {
        return this.requiredAs(name, Types.MAP);
    }

    requiredAsProcedure(name: string): Procedure {
        return this.requiredAs(name, Types.PROCEDURE);
    }

    requiredAsQuantity(name: string): Quantity {
        return this.requiredAs(name, Types.QUANTITY);
    }

    requiredAsText(name: string): string {
        return this.requiredAs(name, Types.TEXT);
    }

    requiredAsType(name: string): string {
        return this.requiredAs(name, Types.TYPE);
    }

    requiredAsUnit(name: string): Unit {
        return this.requiredAs(name, Types.UNIT);
    }

    put(values?: { [name: string]: any }): Scope {
        if (values) {
            for (var name in values) {
                this.set(name, values[name]);
            }
        }

        return this;
    }

    register(definition: Definition): Scope {
        return this.set(definition.name, definition);
    }

    set(name: string, value: any): Scope {
        this.values[name] = value;

        return this;
    }

    as(type: Type, value: any): any {
        if (type.acceptsValue(value)) {
            return value;
        }

        let distinctType = type.toDistinctType();

        try {
            return this.invoke("as" + distinctType.name, { value: value, param: distinctType.param });
        }
        catch (error) {
            throw new Error(`Conversion to ${type} failed: ${value}\n\tcaused by ${Utils.indent(error.stack.toString())}`);
        }
    }

    asBool(value: any): boolean {
        return this.as(Types.BOOL, value);
    }

    asList(value: any): any[] {
        return this.as(Types.LIST, value);
    }

    asMap(value: any): Object {
        return this.as(Types.MAP, value);
    }

    asProcedure(value: any): Procedure {
        return this.as(Types.PROCEDURE, value);
    }

    asQuantity(value: any): Quantity {
        return this.as(Types.QUANTITY, value);
    }

    asText(value: any): string {
        return this.as(Types.TEXT, value);
    }

    asType(value: any): string {
        return this.as(Types.TYPE, value);
    }

    asUnit(value: any): Unit {
        return this.as(Types.UNIT, value);
    }

}