import {Scope} from "./../Scope";

import * as Utils from "./../util/Utils";

export abstract class Command implements Utils.Descripted {

    constructor(private _line: number, private _column: number, private _implementation: (scope: Scope) => any, private _describe: (language?: string) => string) {
    }

    get line() {
        return this._line;
    }

    get column() {
        return this._column;
    }

    execute(scope: Scope): any {
        try {
            return this._implementation(scope);
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
