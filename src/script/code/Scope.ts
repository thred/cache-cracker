import {Definition} from "./Definition";
import {Expression} from "./Expression";
import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

import * as Utils from "./Utils";

export class Scope {

    private values: { [name: string]: any } = {};

    constructor(private _parent: Scope) {
    }

    derive(params?: { [name: string]: any }): Scope {
        return new Scope(this).put(params);
    }

    get parent(): Scope {
        return this._parent;
    }

    get(name: string, defaultValue?: any): any {
        let value = this.values[name];

        if (value === undefined) {
            let scope: Scope = this;

            while ((value === undefined) && (scope.parent)) {
                scope = scope.parent;
                value = scope.values[name];
            }
        }

        if ((value === undefined) || (value === null)) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }

            return value;
        }

        if (value instanceof Expression) {
            value = (value as Expression).invoke(this);
        }

        return value;
    }

    getAsDefinition(name: string): Definition {
        let value = this.get(name);

        if ((value === undefined) || (value === null)) {
            return value;
        }

        if (value["fn"]) {
            return value;
        }

        throw new Error(`Conversion to Definition failed: ${value}`);
    }

    getAsArray(name: string): any[] {
        let values = this.get(name);

        if (!Array.isArray(values)) {
            values = this.derive({ value: values }).invoke("asArray");
        }

        if ((values === undefined) || (values === null)) {
            return values;
        }

        let results: any[] = [];

        for (let item of values) {
            if (item instanceof Expression) {
                results.push((item as Expression).invoke(this));
            }
            else {
                results.push(item);
            }
        }

        return results;
    }

    getAsQuantity(name: string, defaultValue?: Quantity): Quantity {
        let value = this.get(name, defaultValue);

        if (value instanceof Quantity) {
            return value;
        }

        return this.derive({ value: value }).invoke("asQuantity");
    }

    getAsString(name: string, defaultValue?: string): string {
        let value = this.get(name, defaultValue);

        if (typeof value === "string") {
            return value;
        }

        return this.derive({ value: value }).invoke("asString");
    }

    getAsUnit(name: string, defaultValue?: Unit): Unit {
        let value = this.get(name, defaultValue);

        if (value instanceof Unit) {
            return value;
        }

        return this.derive({ value: value }).invoke("asUnit");
    }

    invoke(name: string): any {
        let definition = this.requiredAsDefinition(name);

        try {
            return definition.fn(this)
        }
        catch (error) {
            throw new Error(`Invocation failed: ${name}. Error caused by: ${error}`);
        }
    }

    required(name: string): any {
        return Utils.required(this.get(name), `Required value is not defined: ${name}`);
    }

    requiredAsDefinition(name: string): Definition {
        return Utils.required(this.getAsDefinition(name), `Required definition is not defined: ${name}`);
    }

    requiredAsArray(name: string): any[] {
        return Utils.required(this.getAsArray(name), `Required array is not defined: ${name}`);
    }

    requiredAsQuantity(name: string): Quantity {
        return Utils.required(this.getAsQuantity(name), `Required quantity is not defined: ${name}`);
    }

    requiredAsString(name: string): string {
        return Utils.required(this.getAsString(name), `Required string is not defined: ${name}`);
    }

    requiredAsUnit(name: string): Unit {
        return Utils.required(this.getAsUnit(name), `Required unit is not defined: ${name}`);
    }

    put(values?: { [name: string]: any }): Scope {
        if (values) {
            for (var name in values) {
                this.set(name, values[name]);
            }
        }

        return this;
    }

    register(definition: Definition): Scope {
        return this.set(definition.name, definition);
    }

    set(name: string, value: any): Scope {
        this.values[name] = value;

        return this;
    }

}