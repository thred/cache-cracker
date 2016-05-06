import * as Utils from "./Utils";

import {Scope} from "./../Scope";

import {Definition} from "./../util/Definition";

export class Context {

    private _definitions: { [name: string]: Definition } = {};

    constructor(private _parent: Context) {
    }

    get parent() {
        return this._parent;
    }

    get definitions() {
        return this._definitions;
    }

    createScope(parent?: Scope): Scope {
        let scope = new Scope(parent);

        for (let name in this._definitions) {
            scope.set(name, this._definitions[name].initialValue);
        }

        return scope;
    }

    derive(): Context {
        return new Context(this);
    }

    isProcedure(name: string): boolean {
        let definition = this.get(name);

        if (!definition) {
            return false;
        }

        return definition instanceof Procedure;
    }

    isVariable(name: string): boolean {
        let definition = this.get(name);

        if (!definition) {
            return false;
        }

        return definition instanceof Variable;
    }

    get(name: string): Definition {
        let definition = this._definitions[name];

        if (definition === undefined) {
            let context: Context = this;

            while ((definition === undefined) && (context.parent)) {
                context = context.parent;
                definition = context._definitions[name];
            }
        }

        return definition;
    }

    getAsProcedure(name: string): Procedure {
        let definition = this.get(name);

        if ((definition === undefined) || (definition === null)) {
            return (definition as Procedure);
        }

        if (!(definition instanceof Procedure)) {
            throw new Error(`Definition is not a procedure: ${name}`);
        }

        return (definition as Procedure);
    }

    getAsVariable(name: string): Variable {
        let definition = this.get(name);

        if ((definition === undefined) || (definition === null)) {
            return definition;
        }

        if (!(definition instanceof Variable)) {
            throw new Error(`Definition is not a variable: ${name}`);
        }

        return definition;
    }

    required(name: string): Definition {
        return Utils.required(this.get(name), `Required definition is not defined: ${name}`);
    }

    requiredAsProcedure(name: string): Procedure {
        return Utils.required(this.getAsProcedure(name), `Required procedure is not defined: ${name}`);
    }

    requiredAsVariable(name: string): Variable {
        return Utils.required(this.getAsVariable(name), `Required variable is not defined: ${name}`);
    }

    define<AnyDefinition extends Definition>(definition: AnyDefinition): AnyDefinition {
        this._definitions[definition.name] = definition;

        return definition;
    }
}
