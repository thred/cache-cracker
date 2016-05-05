import {Environment} from "./../Environment";
import {Scope} from "./../Scope";

import {Definition} from "./../definition/Definition";
import {Parameter} from "./../definition/Parameter";
import {Procedure} from "./../definition/Procedure";
import {Variable} from "./../definition/Variable";

import {Context} from "./../util/Context";

export class Module {

    private _context: Context = new Context(null);

    constructor() {
    }

    define<AnyDefinition extends Procedure | Variable>(definition: AnyDefinition): AnyDefinition {
        return this._context.define(definition);
    }

    parameter(name: string, description: string, defaultValue?: any): Parameter {
        return new Variable(name, description, defaultValue);
    }

    procedure(name: string, description: string, params: Parameter[], implementation: (scope: Scope) => any): Procedure {
        return this._context.define(new Procedure(name, description, params, implementation));
    }

    variable(name: string, description: string, initialValue: any = null): Variable {
        return this._context.define(new Variable(name, description, initialValue));
    }

    populate(context: Context): void {
        let definitions = this._context.definitions;

        for (let name in definitions) {
            context.define(definitions[name]);
        }
    }

}