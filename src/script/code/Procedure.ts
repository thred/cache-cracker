import {Definition} from "./Definition";
import {Scope} from "./Scope";
import {Type, Types} from "./Type";

import {Context} from "./util/Context";

import * as Utils from "./util/Utils";

export class Procedure implements Utils.Descripted {

    static of(params: Definition[], result: Definition, impl?: (scope: Scope) => any) {
        return new Procedure(params, result, impl);
    }

    constructor(private _params: Definition[], private _result: Definition, private _impl?: (scope: Scope) => any) {
    }

    get params(): Definition[] {
        return this._params;
    }

    findParam(name: string): Definition {
        for (let param of this._params) {
            if (param.name === name) {
                return param;
            }
        }

        return null;
    }

    get result(): Definition {
        return this._result;
    }

    createContext(parent?: Context) {
        let context = new Context(parent);

        for (let param of this._params) {
            context.define(param);
        }

        return context;
    }

    invoke(scope: Scope, arg: any): any {
        let map: Utils.Map;
        let type: Type = Type.of(arg);

        if ((Types.BOOL.accepts(type)) || (Types.PROCEDURE.accepts(type)) || (Types.QUANTITY.accepts(type)) ||
            (Types.TEXT.accepts(type)) || (Types.TYPE.accepts(type)) || (Types.UNIT.accepts(type))) {

            if (1 > this.params.length) {
                throw new Error(`Too many arguments in procedure call (${1} > ${this.params.length}): ${this.describe()}`);
            }

            map = {};

            map[this.params[0].name] = arg;
        }
        else if (Types.LIST.accepts(type)) {
            let list = arg as any[];

            if (list.length > this.params.length) {
                throw new Error(`Too many arguments in procedure call (${list} > ${this.params.length}): ${this.describe()}`);
            }

            map = {};

            for (let index = 0; index < list.length; index++) {
                map[this.params[index].name] = list[index];
            }
        }
        else if (Types.MAP.accepts(type)) {
            map = arg as Utils.Map;
        }
        else {
            throw new Error(`Unsupported argument type "${type}" with procedure call: ${this.describe()}`);
        }

        let childScope = scope.derive();

        for (let param of this.params) {
            let name = param.name;
            let value = map[name];

            if (value === undefined) {
                if (param.initialValue === undefined) {
                    throw new Error(`Required argument "${name}" is missing in procedure call: ${this.describe()}`);
                }

                value = param.initialValue;
            }

            try {
                value = scope.as(param.type, value);
            }
            catch (error) {
                throw new Error(`Argument "${name}" cannot be converted to "${param.type}" for procedure call: ${this.describe()}.\n\tCaused by ${Utils.indent(error.stack.toString())}`);
            }

            childScope.set(name, value);
        }

        try {
            return this._impl(childScope);
        }
        catch (error) {
            throw new Error(`Failed to invoke procedure.\n\tCaused by ${Utils.indent(error.stack.toString())}`);
        }
    }

    describe(language: string = Utils.language): string {
        return `fn(${this.params.map((param) => `${param.name}: ${param.type.describe(language)}`).join(", ")}): ${this.result.type.describe(language)} {..}`
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
