import {Scope} from "./Scope";

import * as Utils from "./Utils";

export class Expression {

    constructor(private _line: number, private _column: number, private _invoke: (scope: Scope) => any, private _describe: () => string) {
    }

    get line() {
        return this._line;
    }

    get column() {
        return this._column;
    }

    invoke(scope?: Scope): any {
        try {
            return this._invoke(scope);
        }
        catch (error) {
            throw new Error(Utils.formatError(this._line, this._column, `Invocation failed: ${this.describe()}`, error));
        }
    }

    describe(): string {
        return this._describe();
    }

    toString(): string {
        return this.describe();
    }
}
