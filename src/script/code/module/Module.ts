import {Environment} from "./../Environment";
import {Procedure} from "./../Procedure";
import {Scope} from "./../Scope";

import {Context} from "./../util/Context";
import {Definition} from "./../util/Definition";

export class Module {

    private _context: Context = new Context(null);

    constructor() {
    }

    define(definition: Definition): Definition {
        return this._context.define(definition);
    }

    procedure(name: string, description: string, params: Definition[], impl: (scope: Scope) => any): Definition {
        return this.variable(name, description, new Procedure(params, impl));
    }

    variable(name: string, description: string, initialValue: any = null): Definition {
        return new Definition(name, description, initialValue);
    }

    populate(context: Context): void {
        let definitions = this._context.definitions;

        for (let name in definitions) {
            context.define(definitions[name]);
        }
    }

}