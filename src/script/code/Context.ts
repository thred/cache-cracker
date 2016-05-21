import {Definition} from "./Definition";
import {Msg, msg, defMsg} from "./Msg";
import {Scope} from "./Scope";
import {Script} from "./Script";
import {Type, Types} from "./Type";

import * as Utils from "./Utils";

import {CommandParser} from "./parser/CommandParser";
import {Scanner} from "./parser/Scanner";

/**
 * A `Context` holds the compile time information of all variables: these are the predefined `Definition`s
 * from the `Module`s and the `Definition`s created by compiling the script. A `Context` is a member of a
 * hierachy, linked by the parent property. 
 * 
 * When compiling a script, each `Procedure` gets it's own `Context` linked to it's parent. The inner `Context`
 * is holding the parameters and the local variables. In fact any block has it's own context (yes, any block).
 */
export class Context {

    private _accent: string;
    private _parent: Context;
    private _definitions: { [name: string]: Definition } = {};

    /**
     * Creates a new `Context`. With a root `Context`, an accent has to be set, otherwise a parent has to be linked.
     * 
     * @param accentOrParent either an accent or a parent
     */
    constructor(accentOrParent: string | Context) {
        if (typeof accentOrParent === "string") {
            this._accent = accentOrParent as string;
            this._parent = null;
        }
        else {
            this._parent = accentOrParent as Context;
            this._accent = this._parent._accent;
        }
    }

    /**
     * Register one or more new `Definition`s.
     * 
     * @param definitions the `Definition`s to register
     * @returns the `Context` itself
     */
    register(...definitions: Definition[]): this {
        definitions.forEach((definition) => this._definitions[definition.getName(this.accent)] = definition);

        return this;
    }

    /**
     * @returns the accent of this `Context`.
     */
    get accent() {
        return this._accent;
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
        let scope: Scope;

        if (parentScope) {
            this.verifyScope(parentScope);

            scope = new Scope(parentScope);
        }
        else if (this.parent) {
            scope = new Scope(this.parent.createScope());
        }
        else {
            scope = new Scope(this.accent);
        }

        for (let name in this._definitions) {
            scope.set(name, this._definitions[name].createInitialValue(scope));
        }

        return scope;
    }

    /**
     * Verifies the `scope`; the accent must match with the context and it must contain all the variables 
     * that are defined by this `Context` and the variables must be of an acceptable type. 
     * Throws an error if this is not the case.
     * 
     * @param scope the `Scope` to be verify.
     */
    verifyScope(scope: Scope): void {
        if (this.accent !== scope.accent) {
            throw new Error(`Failed to verify scope. Accents do not match: ${this.accent} != ${scope.accent}`)
        }

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

    /**
     * Ensures, that the `Definition` with the specified name exists, and (optionally) is accepted by the specified `Type`.
     * 
     * @param name the name of the `Definition`
     * @param type an optional `Type` to verify the `Definition` 
     * @returns the `Definition` with the specified name. Asks it's parent `Context` if this
     *      `Context` does not contain it. If the `Definition` is missing, it will raise an error.
     */
    required(name: string, type?: Type): Definition {
        let definition = Utils.required(this.get(name), `Required definition is not defined: ${name}`);

        if ((type) && (!type.accepts(definition.type))) {
            throw new Error(`Required definition does not match type "${Utils.toScript(this._accent, type)}": ${Utils.toScript(this._accent, definition)}`)
        }

        return definition;
    }

}
