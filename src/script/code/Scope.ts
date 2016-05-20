import {Definition} from "./Definition";
import {Msg, msg, defMsg} from "./Msg";
import {Procedure} from "./Procedure";
import {Quantity} from "./Quantity";
import {Command} from "./Command";
import {TypeName, DistinctType, Type, Types} from "./Type";
import {Unit} from "./Unit";

import * as Globals from "./Globals";
import * as Transformations from "./Transformations";
import * as Utils from "./Utils";

export class Scope {

    private _accent: string;
    private _parent: Scope;
    private _values: { [name: string]: any } = {};

    /**
     * Creates a new `Scope`. With a root `Scope`, an accent has to be set, otherwise a parent has to be linked.
     * 
     * @param accentOrParent either an accent or a parent
     */
    constructor(accentOrParent: string | Scope) {
        if (typeof accentOrParent === "string") {
            this._accent = accentOrParent as string;
            this._parent = null;
        }
        else {
            this._parent = accentOrParent as Scope;
            this._accent = this._parent._accent;
        }
    }

    derive(params?: { [name: string]: any }): Scope {
        return new Scope(this).put(params);
    }

    get parent(): Scope {
        return this._parent;
    }

    get accent(): string {
        return this._accent;
    }

    /**
     * Ensures, that the name is a string. If the name is a `Msg`, it translates it using the `accent`.
     * 
     * @param name the name as string or `Msg` 
     */
    toName(name: Msg) {
        if ((name === undefined) || (name === null) || (typeof name === "string")) {
            return name;
        }

        return msg(this.accent, name);
    }

    get(name: Msg, defaultValue?: any): any {
        name = this.toName(name);

        let value = this._values[name as string];

        if (value === undefined) {
            let scope: Scope = this;

            while ((value === undefined) && (scope.parent)) {
                scope = scope.parent;
                value = scope._values[name as string];
            }
        }

        if ((value === undefined) || (value === null)) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }

            return value;
        }

        return value;
    }

    getAs(name: Msg, type: Type, defaultValue?: any): any {
        return this.as(type, this.get(name, defaultValue));
    }

    getAsList(name: Msg, defaultValue?: any[]): any[] {
        return this.getAs(name, Types.LIST, defaultValue);
    }

    getAsLogicalValue(name: Msg, defaultValue?: boolean): boolean {
        return this.getAs(name, Types.LOGICAL_VALUE, defaultValue);
    }

    getAsMap(name: Msg, defaultValue?: Object): Object {
        return this.getAs(name, Types.MAP, defaultValue);
    }

    getAsProcedure(name: Msg, defaultValue?: Procedure): Procedure {
        return this.getAs(name, Types.PROCEDURE, defaultValue);
    }

    getAsQuantity(name: Msg, defaultValue?: Quantity): Quantity {
        return this.getAs(name, Types.QUANTITY, defaultValue);
    }

    getAsText(name: Msg, defaultValue?: string): string {
        return this.getAs(name, Types.TEXT, defaultValue);
    }

    getAsType(name: Msg, defaultValue?: Type): Type {
        return this.getAs(name, Types.TYPE, defaultValue);
    }

    getAsUnit(name: Msg, defaultValue?: Unit): Unit {
        return this.getAs(name, Types.UNIT, defaultValue);
    }

    required(name: Msg): any {
        return Utils.required(this.get(name), `Required value is not defined: ${this.toName(name)}`);
    }

    requiredAs(name: Msg, type: Type): any {
        return Utils.required(this.getAs(name, type), `Required ${type} is not defined: ${this.toName(name)}`);
    }

    requiredAsList(name: Msg): any[] {
        return this.requiredAs(name, Types.LIST);
    }

    requiredAsLogicalValue(name: Msg): boolean {
        return this.requiredAs(name, Types.LOGICAL_VALUE);
    }

    requiredAsMap(name: Msg): Object {
        return this.requiredAs(name, Types.MAP);
    }

    requiredAsProcedure(name: Msg): Procedure {
        return this.requiredAs(name, Types.PROCEDURE);
    }

    requiredAsQuantity(name: Msg): Quantity {
        return this.requiredAs(name, Types.QUANTITY);
    }

    requiredAsText(name: Msg): string {
        return this.requiredAs(name, Types.TEXT);
    }

    requiredAsType(name: Msg): Type {
        return this.requiredAs(name, Types.TYPE);
    }

    requiredAsUnit(name: Msg): Unit {
        return this.requiredAs(name, Types.UNIT);
    }

    put(values?: { [name: string]: any }): Scope {
        if (values) {
            for (var name in values) {
                this.set(name, values[name]);
            }
        }

        return this;
    }

    // register(definition: Definition): Scope {
    //     return this.set(definition.name, definition);
    // }

    set(name: string, value: any): Scope {
        this._values[name] = value;

        return this;
    }

    as(type: Type, value: any): any {
        // FIXME do not call Transformations directly. Methods may be overwritten!
        
        try {
            return Transformations.to(this.accent, this.get(Globals.VAR_DEFAULT_LANGUAGE), type, value);
        }
        catch (error) {
            throw new Error(`Conversion to ${type} failed: ${value}\n\tcaused by ${Utils.indent(error.stack.toString())}`);
        }
    }

    asList(value: any): any[] {
        return this.as(Types.LIST, value);
    }

    asLogicalValue(value: any): boolean {
        return this.as(Types.LOGICAL_VALUE, value);
    }

    asMap(value: any): Utils.Map {
        return this.as(Types.MAP, value);
    }

    asProcedure(value: any): Procedure {
        return this.as(Types.PROCEDURE, value);
    }

    asQuantity(value: any): Quantity {
        return this.as(Types.QUANTITY, value);
    }

    asText(value: any): string {
        return this.as(Types.TEXT, value);
    }

    asType(value: any): string {
        return this.as(Types.TYPE, value);
    }

    asUnit(value: any): Unit {
        return this.as(Types.UNIT, value);
    }

}