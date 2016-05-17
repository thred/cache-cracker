import {Command} from "./Command";
import {Context} from "./Context";
import {Module} from "./Module";
import {Scope} from "./Scope";
import {Script} from "./Script";

import * as Globals from "./Globals";

import * as DefaultModule from "./module/DefaultModule";
import * as MathModule from "./module/MathModule";
import * as TextAnalysisModule from "./module/TextAnalysisModule";
import * as TextModule from "./module/TextModule";
import * as TransformationModule from "./module/TransformationModule";

import {CommandParser} from "./parser/CommandParser";
import {Scanner} from "./parser/Scanner";

export class Environment {

    static DEFAULT: Environment = new Environment(Globals.DEFAULT_ACCENT).include(DefaultModule.MODULE, MathModule.MODULE, TextAnalysisModule.MODULE,
        TextModule.MODULE, TransformationModule.MODULE);

    private context: Context;

    constructor(private _accent: string) {
        this.context = new Context(_accent);
    }

    get accent() {
        return this._accent;
    }

    include(...modules: Module[]): this {
        modules.forEach((module) => module.populate(this.context));

        return this;
    }

    createContext(): Context {
        return this.context.derive();
    }

    parse(source: string | Scanner): Script {
        return this.createContext().parse(source);
    }

}