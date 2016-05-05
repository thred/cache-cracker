import * as Utils from "./Utils";

export class Identifier {

    static parse(language: string, o: any): Identifier {
        if ((o === undefined) || (o === null)) {
            return o;
        }

        if (o instanceof Identifier) {
            return o;
        }

        return new Identifier(o.toString().trim());
    }

    constructor(private _name: string) {
        if (!Utils.isIdentifier(_name)) {
            throw new Error(`Invalid identifier: ${_name}`)
        }
    }

    get name() {
        return this._name;
    }

}