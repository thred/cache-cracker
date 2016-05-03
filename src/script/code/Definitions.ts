import {Command} from "./Command";
import {Definition} from "./Definition";
import {List} from "./List";
import {Map} from "./Map";
import {Scope} from "./Scope";

export class Procedure extends Definition {

    constructor(name: string, description: string, private _parameters: Definition[], defaultImplementation?: (scope: Scope) => any) {
        super(name, description, defaultImplementation);
    }

    get parameters(): Definition[] {
        return this._parameters;
    }

    findParameterByName(name: string): Definition {
        for (let parameter of this._parameters) {
            if (parameter.name === name) {
                return parameter;
            }
        }

        return null;
    }

    invoke(scope: Scope, arg?: Command): any {
        let implementation: (scope: Scope) => any = super.invoke(scope, arg);
        let map: Map;
        let args = arg.invoke(scope);

        if (args instanceof Map) {
            map = args;
        }
        // TODO add other types
        else {
            throw new Error(`Unsupported type of arguments: ${args}`);
        }

        // TODO check parameters!

        scope = scope.derive();

        for (let key in map.keys()) {
            scope.set(key, map.get(key, true));
        }

        try {
            return implementation(scope);
        }
        catch (error) {
            throw new Error(`Failed to invoke function: ${this.name}. Error caused by: ${error}`);
        }
    }

    describe(language: string): string {
        let description = "Procedure: " + super.describe(language);

        if ((this._parameters) && (this._parameters.length > 0)) {
            description += "\n\n";

            for (let key in Object.keys(this.parameters)) {
                description += `${key}: ${this.parameters[key]}`;
            }
        }

        return description;
    }
}

export class Variable extends Definition {

    constructor(name: string, description: string, defaultValue?: any) {
        super(name, description, defaultValue);
    }

    describe(language: string): string {
        return "Variable: " + super.describe(language);
    }
}
