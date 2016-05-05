import {Command} from "./Command";
import {Context} from "./Context";
import {Definition} from "./Definition";
import {Parser} from "./Parser";
import {Quantity} from "./Quantity";
import {Scanner} from "./Scanner";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Conversions from "./Conversions";
import * as Definitions from "./Definitions";
import * as Math from "./Math";
import * as Strings from "./Strings";

export class Code {

    globalContext: Context = new Context(null);
    globalScope: Scope = new Scope(null);

    constructor() {
        populate(this);
    }

    scan(source: string | Scanner): Scanner {
        return (typeof source === "string") ? new Scanner(source) : source;
    }

    parse(source: string | Scanner): Command {
        return new Parser(this.scan(source)).parseStatement(this.globalContext.derive());
    }

    execute(source: string | Scanner | Command): any {
        if (!(source instanceof Command)) {
            source = this.parse(source as string | Scanner);
        }

        return (source as Command).invoke(this.globalScope.derive());
    }

    defineProcedure(name: string, description: string, parameters: Definition[], implementation: (scope: Scope) => any): Code {
        this.globalContext.define(new Definitions.Procedure(name, description, parameters));
        this.globalScope.set(name, implementation);

        return this;
    }

    defineVariable(name: string, description: string, value: any): Code {
        this.globalContext.define(new Definitions.Variable(name, description));
        this.globalScope.set(name, value);

        return this;
    }

}

export function populate(code: Code) {
    code.defineVariable("language", "The default language.", "en-US");

    Conversions.populate(code);
    Math.populate(code);
    Strings.populate(code);
}



