import {Scope} from "./Scope";
import {Type} from "./Type";

import * as Globals from "./Globals";
import * as Utils from "./Utils";

export abstract class Command implements Utils.Scripted {

    constructor(private _line: number, private _column: number, private _type: Type,
        private _impl: (scope: Scope) => any, private _toScript: (accent: string) => string) {
    }

    get line(): number {
        return this._line;
    }

    get column(): number {
        return this._column;
    }

    get type(): Type {
        return this._type;
    }

    execute(scope: Scope): any {
        try {
            return this._impl(scope);
        }
        catch (error) {
            throw new Error(Utils.formatError(this._line, this._column, `Invocation failed: ${this.toScript(scope.accent)}`, error));
        }
    }

    toScript(accent: string): string {
        return this._toScript(accent);
    }

    toString(): string {
        return this.toScript(Globals.DEFAULT_ACCENT);
    }
}
