import {Definition} from "./Definition";
import {Scope} from "./Scope";

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

    invoke(scope: Scope): any {
        try {
            return this._impl(scope);
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
