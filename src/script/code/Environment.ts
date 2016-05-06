import {Scope} from "./Scope";
import {Script} from "./Script";

import {Command} from "./command/Command";

import {Module} from "./module/Module";

import * as ConversionModule from "./module/ConversionModule";
import * as MathModule from "./module/MathModule";
import * as StringModule from "./module/StringModule";

import {CommandParser} from "./util/CommandParser";
import {Context} from "./util/Context";
import {Scanner} from "./util/Scanner";

export class Environment {

    static DEFAULT: Environment = new Environment().include(ConversionModule.MODULE).include(MathModule.MODULE).include(StringModule.MODULE);

    _context: Context = new Context(null);

    constructor() {
    }

    include(module: Module): this {
        module.populate(this._context);

        return this;
    }

    scan(source: string | Scanner): Scanner {
        return (typeof source === "string") ? new Scanner(source) : source;
    }

    parse(source: string | Scanner): Script {
        let parser = new CommandParser(this.scan(source));
        let command = parser.parseStatement(this._context.derive());

        return new Script(this._context, command);
    }

}