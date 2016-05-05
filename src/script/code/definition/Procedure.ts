import {Definition} from "./Definition";
import {Parameter} from "./Parameter";

import {Scope} from "./../Scope";

import {Context} from "./../util/Context";

export class Procedure extends Definition {

    constructor(name: string, description: string, private _params: Parameter[], implementation?: (scope: Scope) => any) {
        super(name, description, implementation);
    }

    get params(): Parameter[] {
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
        let description = `Procedure: ${super.describe(language)}`;

        if (this._params.length > 0) {
            description += "\n";

            for (let param of this._params) {
                description += `\n${param.name}: ${param.description}`;
            }
        }

        return description;
    }
}
