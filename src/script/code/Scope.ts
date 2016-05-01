export class Scope {

    private variables: { [name: string]: any };

    constructor(private _parent?: Scope) {
    }

    get parent() {
        return this._parent;
    }

    get(name: string): any {
        let variable = this.variables[name];

        if (variable !== undefined) {
            return variable;
        }

        return (this.parent) ? this.parent.get(name) : null;
    }

    set(name: string, ): Definition {
        this.variables[definition.name] = definition;

        return definition;
    }


}