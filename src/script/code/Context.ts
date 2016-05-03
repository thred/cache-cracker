import {Definition} from "./Definition";
import {Scope} from "./Scope";

import * as Definitions from "./Definitions";
import * as Utils from "./Utils";

export class Context {

    private definitions: { [name: string]: Definition } = {};

    constructor(private _parent: Context) {
    }

    get parent() {
        return this._parent;
    }

    derive(): Context {
        return new Context(this);
    }

    isProcedure(name: string): boolean {
        let definition = this.get(name);

        if (!definition) {
            return false;
        }

        return definition instanceof Definitions.Procedure;
    }

    isVariable(name: string): boolean {
        let definition = this.get(name);

        if (!definition) {
            return false;
        }

        return definition instanceof Definitions.Variable;
    }

    get(name: string): Definition {
        let definition = this.definitions[name];

        if (definition === undefined) {
            let context: Context = this;

            while ((definition === undefined) && (context.parent)) {
                context = context.parent;
                definition = context.definitions[name];
            }
        }

        return definition;
    }

    getAsProcedure(name: string): Definitions.Procedure {
        let definition = this.get(name);

        if ((definition === undefined) || (definition === null)) {
            return (definition as Definitions.Procedure);
        }

        if (!(definition instanceof Definitions.Procedure)) {
            throw new Error(`Definition is not a procedure: ${name}`);
        }

        return (definition as Definitions.Procedure);
    }

    getAsVariable(name: string): Definitions.Variable {
        let definition = this.get(name);

        if ((definition === undefined) || (definition === null)) {
            return definition;
        }

        if (!(definition instanceof Definitions.Variable)) {
            throw new Error(`Definition is not a variable: ${name}`);
        }

        return definition;
    }

    required(name: string): Definition {
        return Utils.required(this.get(name), `Required definition is not defined: ${name}`);
    }

    requiredAsProcedure(name: string): Definitions.Procedure {
        return Utils.required(this.getAsProcedure(name), `Required procedure is not defined: ${name}`);
    }

    requiredAsVariable(name: string): Definitions.Variable {
        return Utils.required(this.getAsVariable(name), `Required variable is not defined: ${name}`);
    }

    defineProcedure(name: string, description: string, parameters: Definition[], defaultImplementation?: (scope: Scope) => any): Definition {
        return this.define(new Definitions.Procedure(name, description, parameters, defaultImplementation));
    }

    defineVariable(name: string, description: string, defaultValue?: any): Definition {
        return this.define(new Definitions.Variable(name, description, defaultValue));
    }

    define(definition: Definition): Definition {
        this.definitions[definition.name] = definition;

        return definition;
    }
}
