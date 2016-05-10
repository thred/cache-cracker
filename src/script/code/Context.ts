import {Definition} from "./Definition";
import {Scope} from "./Scope";
import {Script} from "./Script";
import {Type, Types} from "./Type";

import {CommandParser} from "./util/CommandParser";
import {Scanner} from "./util/Scanner";

import * as Utils from "./util/Utils";

/**
 * A `Context` holds the compile time information of all variables: these are the predefined `Definition`s
 * from the `Module`s and the `Definition`s creates by compiling the script. A `Context` is a member of a
 * hierachy, liked by the parent property. 
 * 
 * When compiling a script, each `Procedure` gets it's own `Context` linked to it's parent. The inner `Context`
 * is holding the parameters and the local variables. In fact any block has it's own context. 
 */
export class Context {

    private _definitions: { [name: string]: Definition } = {};

    constructor(private _parent: Context) {
    }

    /**
     * @returns the parent of this `Context`. This may be null if the `Context` is the root `Context`.
     */
    get parent() {
        return this._parent;
    }

    /**
     * @returns all the definitions of this `Context`.
     */
    get definitions() {
        return this._definitions;
    }

    /**
     * Parses the specified `source`.
     * 
     * @source the source as string or `Scanner`
     * @returns the compiled `Script`
     */
    parse(source: string | Scanner): Script {
        let parser = new CommandParser(source);
        let command = parser.parseStatement(this);

        return new Script(this, command);
    }

    /**
     * Creates a `Scope` from this `Context`. If a `parentScope` is defined, it verifies the `Scope` by calling the
     * `verifyScope` method of it's `parent` `Context`. If no `parentScope` is defined, it uses it `parent` `Context`
     * to create it.
     * 
     * @param parentScope an optional parent `Scope`
     * @returns a new `Scope` 
     */
    createScope(parentScope?: Scope): Scope {
        if (parentScope) {
            this.verifyScope(parentScope);
        }
        else if (this.parent) {
            parentScope = this.parent.createScope();
        }

        let scope = new Scope(parentScope);

        for (let name in this._definitions) {
            scope.set(name, this._definitions[name].initialValue);
        }

        return scope;
    }

    /**
     * Verifies the `scope`; it must contain all the variables that are defined by this `Context`
     * and the variables must be of an acceptable type.
     * Throws an error if this is not the case.
     * 
     * @param scope the `Scope` to be verify.
     */
    verifyScope(scope: Scope): void {
        for (let name in this._definitions) {
            let definition = this._definitions[name];
            let variable = scope.get(name);

            if (variable === undefined) {
                throw new Error(`Scope is missing the variable "${name}"`);
            }

            if (!definition.type.acceptsValue(variable)) {
                throw new Error(`Scope is missing the variable "${name}"`);
            }
        }
    }

    /**
     * @returns a new `Context` with this `Context` as parent.
     */
    derive(): Context {
        return new Context(this);
    }

    /**
     * @param name the name of the `Definition`
     * @returns the `Definition` with the specified name. Asks it's parent `Context` if this
     *      `Context` does not contain it.
     */
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
