import {Procedure} from "./../Procedure";
import {Quantity} from "./../Quantity";
import {Unit} from "./../Unit";

export type TypeName = "Boolean" | "List" | "Map" | "Procedure" | "Quantity" | "Text" | "Unit";

export class Type {
    
    static of(name: TypeName | TypeName[]): Type {
        return new Type(name);
    }
    
    private _names: TypeName[] = [];
    
    constructor(name: TypeName | TypeName[]) {
        this.set(name);
    }
    
    add(name: TypeName | TypeName[]): this {
        if (Array.isArray(name)) {
            (name as TypeName[]).forEach((current) => this.add(current));
        }
        
        if (!this.contains(name as TypeName)) {
            this._names.push(name as TypeName);        
        }
        
        return this;
    }
    
    isCompatible(value: any) {
        for (let name of this._names) {
            switch(name) {
                case "Boolean":
                    if (typeof value === "boolean") {
                        return true;
                    }
                    break;
                    
                case "List":
                    if ()
                case "Procedure":
                    if (value instanceof Procedure)
            }
        }
    }
    
    is(name: TypeName): boolean {
        return (this._names.length === 1) && (this._names[0] === name);
    }
    
    contains(name: TypeName): boolean {
        return this._names.indexOf(name) >= 0;
    }

    set(name: TypeName | TypeName[]): this {
        if (Array.isArray(name)) {
            this._names = name;
        }
        else {
            this._names = [name];
        }
        
        return this;
    }
}

function isCompatible(typeName: TypeName, value: any) {
                switch(name) {
                case "Boolean":
                    return (typeof value === "boolean");
                    
                case "List":
                    return (Array.isArray(value));
                    
                case "Procedure":
                    return (value instanceof Procedure);    
                    
                case "Quantity":
                    return (value instanceof Quantity );    
                    
                case "Unit":
                    return (value instanceof Unit);    
                    
                case "Map":
                    return 
                    return 
                case "Procedure":
                    if (value instanceof Procedure)
            }

}

export function isMap(value: any): boolean {
    return (typeof value !== "boolean") && (typeof value !== "number") && (typeof value !== "string") && 
        (!Array.isArray(value)) && (!(value instanceof Procedure)) && (!(value instanceof Quantity)) && (!(value instanceof Unit));
}
