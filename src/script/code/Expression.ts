export interface Scope {

    get(name: string): any;

}

export class InvokeError extends Error {

    constructor(private _line: number, private _column: number, private _message: string, private _cause?: any) {
        super(InvokeError.format(_line, _column, _message, _cause));
    }

    get line(): number {
        return this._line;
    }

    get column(): number {
        return this._column;
    }

    get message(): string {
        return this._message;
    }

    get cause(): any {
        return this._cause;
    }

    static format(line: number, column: number, message: string, cause?: any) {
        let result = `[Ln ${line}, Col ${column}] ${message}`;

        if (cause) {
            result += `\nCaused by ${cause}`;
        }

        return result;
    }
}

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
            throw new InvokeError(this._line, this._column, this.describe(), error);
        }
    }

    describe(): string {
        return this._describe();
    }

    toString(): string {
        return this.describe();
    }
}
