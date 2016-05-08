import {Definition} from "./../Definition";
import {Environment} from "./../Environment";
import {Procedure} from "./../Procedure";
import {Scope} from "./../Scope";

import {Context} from "./../util/Context";

export class Module {

    private _context: Context = new Context(null);

    constructor() {
    }

    define(definition: Definition): Definition {
        return this._context.define(definition);
    }

    populate(context: Context): void {
        let definitions = this._context.definitions;

        for (let name in definitions) {
            context.define(definitions[name]);
        }
    }

}