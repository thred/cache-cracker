import * as Utils from "./../util/Utils";

export abstract class Definition implements Utils.Descripted {

    constructor(private _name: string, private _description: string, private _initialValue?: any) {
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

    get initialValue(): any {
        return this._initialValue;
    }

    // invoke(scope: Scope, arg?: Command): any {
    //     return scope.get(name) || this.fallback();
    // }

    describe(language?: string): string {
        let description = this.name;

        if (this.description) {
            description += "\n\n" + this.description;
        }

        return description;
    }

}