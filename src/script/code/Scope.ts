import * as Utils from "./Utils";

export class Scope {

    private values: { [name: string]: any };

    constructor(private _parent?: Scope) {
    }

    derive(): Scope {
        return new Scope(this);    
    }
    
    get parent() {
        return this._parent;
    }

    get(name: string): any {
        let value = this.values[name];

        if (value !== undefined) {
            return value;
        }

        return (this.parent) ? this.parent.get(name) : undefined;
    }
    
    getAsString(name: string): string {
        
    }

    getAsQuantity(name: string): Quantity {

    }

    invoke(name: string): void {
        
    }    
    
    required(name: string): any {
        return Utils.required(this.get(name), `Required value is undefined: ${name}`);
    }
    
    requiredAsString(name: string): any {
        return Utils.required(this.getAsString(name), `Required value is undefined: ${name}`);
    }

    put(values: { [name: string]: any }): Scope {
        for (var name in values) {
            this.set(name, values[name]);
        }

        return this;
    }

    set(name: string, value: any): Scope {
        this.values[name] = value;

        return this;
    }

}