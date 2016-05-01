import {Definition} from "./Definition";

export class Context {

    private definitions: { [name: string]: Definition };

    constructor(private _parent?: Context) {
    }

    get parent() {
        return this._parent;
    }

    contains(name: string): boolean {
        let definition = this.definitions[name];

        if (definition) {
            return true;
        }

        return (this.parent) ? this.parent.contains(name) : null;
    }

    get(name: string): Definition {
        let definition = this.definitions[name];

        if (definition) {
            return definition;
        }

        return (this.parent) ? this.parent.get(name) : null;
    }

    register(definition: Definition): Definition {
        this.definitions[definition.name] = definition;

        return definition;
    }

}

