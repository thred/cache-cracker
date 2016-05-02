import {Scope} from "./Scope";

import * as Utils from "./Utils";

export class Definition {

    constructor(private _name: string, private _description: string, private _parameters: { [name: string]: string }, private _fn: (scope: Scope) => any) {
        if (!Utils.isIdentifier(_name)) {
            throw new Error(`Invalid name for function: ${_name}`);
        }
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get parameters(): { [name: string]: string } {
        return this._parameters;
    }

    invoke(scope: Scope): any {
        try {
            this._fn(scope);
        }
        catch (error) {
            throw new Error(`Failed to invoke function: ${this.name}. Error caused by: ${error}`);
        }
    }

    describe(language: string): string {
        let description = "Function: " + this.name;

        if (this.description) {
            description += "\n\n" + this.description;
        }

        if ((this.parameters) && (Object.keys(this.parameters).length)) {
            description += "\n\n";

            for (let key in Object.keys(this.parameters)) {
                description += `${key}: ${this.parameters[key]}`;
            }
        }

        return description;
    }

}