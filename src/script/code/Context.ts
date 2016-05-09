import {Definition} from "./Definition";
import {Scope} from "./Scope";
import {Script} from "./Script";
import {Type, Types} from "./Type";

import {CommandParser} from "./util/CommandParser";
import {Scanner} from "./util/Scanner";

import * as Utils from "./util/Utils";

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

    parse(source: string | Scanner): Script {
        let parser = new CommandParser(source);
        let command = parser.parseStatement(this);

        return new Script(this, command);
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

    required(name: string, type?: Type): Definition {
        let definition = Utils.required(this.get(name), `Required definition is not defined: ${name}`);

        if (!type.accepts(definition.type)) {
            throw new Error(`Required definition does not match type "${type.describe()}": ${definition.describe()}`)
        }

        return definition;
    }

    requiredProcedure(name: string): Definition {
        return this.required(name, Types.PROCEDURE);
    }

    define<AnyDefinition extends Definition>(definition: AnyDefinition): AnyDefinition {
        this._definitions[definition.name] = definition;

        return definition;
    }
}