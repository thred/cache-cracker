import {Scope} from "./Scope";
import {Type} from "./Type";

import * as Utils from "./Utils";

export abstract class Command implements Utils.Descripted {

    constructor(private _line: number, private _column: number, private _type: Type,
        private _impl: (scope: Scope) => any, private _describe: (language?: string) => string) {
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
            throw new Error(Utils.formatError(this._line, this._column, `Invocation failed: ${this.describe()}`, error));
        }
    }

    describe(language: string = Utils.language): string {
        return this._describe(language);
    }

    toString(): string {
        return this.describe();
    }
}
