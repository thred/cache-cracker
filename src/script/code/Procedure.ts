import {Scope} from "./Scope";

import {Context} from "./util/Context";
import {Definition} from "./util/Definition";

import * as Utils from "./util/Utils";

export class Procedure implements Utils.Descripted {

    constructor(private _params: Definition[] = [], _impl?: (scope: Scope) => any) {
    }

    get params(): Definition[] {
        return this._params;
    }

    createContext(parent?: Context) {
        let context = new Context(parent);

        for (let param of this._params) {
            context.define(param);
        }

        return context;
    }

    describe(language?: string): string {
        return this.params.map((param) => `\n${param.name}: ${param.description}`).join("\n");
    }

}
