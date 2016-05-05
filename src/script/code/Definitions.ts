import {Definition} from "./Definition";
import {Scope} from "./Scope";

export class Procedure extends Definition {

    constructor(name: string, description: string, private _params: Definition[], defaultImplementation?: (scope: Scope) => any) {
        super(name, description, defaultImplementation);
    }

    get params(): Definition[] {
        return this._params;
    }

    findParamByName(name: string): Definition {
        for (let parameter of this._params) {
            if (parameter.name === name) {
                return parameter;
            }
        }

        return null;
    }

    describe(language?: string): string {
        let description = `Procedure: ${super.describe(language)}`;

        if (this._params.length > 0) {
            description += "\n\n";

            for (let param of this._params) {
                description += `${param.name}: ${param.description}`;
            }
        }

        return description;
    }
}

export class Variable extends Definition {

    constructor(name: string, description: string, defaultValue?: any) {
        super(name, description, defaultValue);
    }

    describe(language?: string): string {
        return `Variable: ${super.describe(language)}`;
    }
}
