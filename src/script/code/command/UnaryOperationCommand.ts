import {Command} from "./Command";

import * as Utils from "./../util/Utils";

export class UnaryOperationCommand extends Command {
    constructor(line: number, column: number, private name: string, private symbol: string, private valueArg: Command) {
        super(line, column,
            (scope) => {
                return scope.invoke(name, {
                    value: valueArg.execute(scope),
                });
            }, () => `${symbol}${valueArg.describe()}`);
    }

    toString(): string {
        return `UnaryOperationCommand(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            value: this.valueArg
        })})`;
    }
}
