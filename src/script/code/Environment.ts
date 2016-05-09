import {Context} from "./Context";
import {Scope} from "./Scope";
import {Script} from "./Script";

import {Command} from "./command/Command";

import {Module} from "./module/Module";

import * as ConversionModule from "./module/ConversionModule";
import * as MathModule from "./module/MathModule";
import * as TextModule from "./module/TextModule";

import {CommandParser} from "./util/CommandParser";
import {Scanner} from "./util/Scanner";

export class Environment {

    static DEFAULT: Environment = new Environment().include(ConversionModule.MODULE, MathModule.MODULE, TextModule.MODULE);

    _context: Context = new Context(null);

    constructor() {
    }

    include(...modules: Module[]): this {
        modules.forEach((module) => module.populate(this._context));

        return this;
    }

    createContext(): Context {
        return this._context.derive();
    }

    parse(source: string | Scanner): Script {
        return this.createContext().parse(source);
    }

}