import {TypeName, Type} from "./Type";

import * as Utils from "./../util/Utils";

export class Definition implements Utils.Descripted {

    private _type: Type;

    constructor(private _name: string, typeName: TypeName | TypeName[], private _description: string, private _params?: Definition[], private _initialValue?: any) {
        if (!Utils.isIdentifier(_name)) {
            throw new Error(`Invalid name for definition: ${_name}`);
        }
        
        this._type = Type.of(typeName);
    }

    get name(): string {
        return this._name;
    }

    get type(): Type {
        return this._type;    
    }
    
    get description(): string {
        return this._description;
    }
    
    get initialValue(): any {
        return this._initialValue;
    }
    
    describe(language?: string): string {
        let description = this.name;

        if (this.description) {
            description += "\n\n" + this.description;
        }

        return description;
    }

}