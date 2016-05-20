import {Context} from "./Context";
import {Definition} from "./Definition";
import {Scope} from "./Scope";
import {Type, Types} from "./Type";

import * as Utils from "./Utils";

export interface Parameter {
    name: string,
    type: Type,
    initialValueProvider?: (scope: Scope) => any
}
export class Procedure implements Utils.Scripted {

    constructor(private _scope: Scope, private _params: Parameter[], private _resultType: Type, private _impl?: (scope: Scope) => any) {
    }

    // get params(): Definition[] {
    //     return this._params;
    // }

    get resultType(): Type {
        return this._resultType;
    }

    // createContext(parent?: Context) {
    //     let context = new Context(parent);

    //     for (let param of this._params) {
    //         context.register(param);
    //     }

    //     return context;
    // }

    invoke(arg: any): any {
        let map: Utils.Map;
        let type: Type = Type.of(arg);

        if ((Types.LOGICAL_VALUE.accepts(type)) || (Types.PROCEDURE.accepts(type)) || (Types.QUANTITY.accepts(type)) ||
            (Types.TEXT.accepts(type)) || (Types.TYPE.accepts(type)) || (Types.UNIT.accepts(type))) {

            if (1 > this._params.length) {
                throw new Error(`Too many arguments in procedure call (${1} > ${this._params.length}): ${Utils.toScript(this._scope.accent, this)}`);
            }

            map = {};

            map[this._params[0].name] = arg;
        }
        else if (Types.LIST.accepts(type)) {
            let list = arg as any[];

            if (list.length > this._params.length) {
                throw new Error(`Too many arguments in procedure call (${list} > ${this._params.length}): ${Utils.toScript(this._scope.accent, this)}`);
            }

            map = {};

            for (let index = 0; index < list.length; index++) {
                map[this._params[index].name] = list[index];
            }
        }
        else if (Types.MAP.accepts(type)) {
            map = arg as Utils.Map;
        }
        else {
            throw new Error(`Unsupported argument type "${type}" with procedure call: ${Utils.toScript(this._scope.accent, this)}`);
        }

        let scope = this._scope.derive();

        for (let param of this._params) {
            let name = param.name;
            let value = map[name];

            if (value === undefined) {
                let initialValue: any = undefined;

                if (param.initialValueProvider) {
                    initialValue = param.initialValueProvider(this._scope);

                    if (!param.type.acceptsValue(initialValue)) {
                        throw new Error(`Type is not compatible with initial value: ${Utils.toScript(this._scope.accent, param.type)})`);
                    }
                }

                if (initialValue === undefined) {
                    throw new Error(`Required argument "${name}" is missing in procedure call: ${Utils.toScript(this._scope.accent, this)}`);
                }

                value = initialValue;
            }

            try {
                value = this._scope.as(param.type, value);
            }
            catch (error) {
                throw new Error(`Argument "${name}" cannot be converted to "${param.type}" for procedure call: ${Utils.toScript(this._scope.accent, this)}.\n\tCaused by ${Utils.indent(error.stack.toString())}`);
            }

            scope.set(name, value);
        }

        try {
            return this._impl(scope);
        }
        catch (error) {
            throw new Error(`Failed to invoke procedure.\n\tCaused by ${Utils.indent(error.stack.toString())}`);
        }
    }



    toScript(accent: string): string {
        return `fn(${this._params.map((param) => `${param.name}: ${Utils.toScript(accent, param.type)}`).join(", ")}): ${Utils.toScript(accent, this._resultType)} {..}`
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
