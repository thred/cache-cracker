import {Command} from "./Command";
import {Scope} from "./Scope";

import * as Utils from "./Utils";

export abstract class Definition {

    constructor(private _name: string, private _description: string, private _fallback: any) {
        if (!Utils.isIdentifier(_name)) {
            throw new Error(`Invalid name for definition: ${_name}`);
        }
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get fallback(): any {
        return this._fallback;
    }

    invoke(scope: Scope, arg?: Command): any {
        return scope.get(name) || this.fallback();
    }

    describe(language: string): string {
        let description = this.name;

        if (this.description) {
            description += "\n\n" + this.description;
        }

        return description;
    }

}