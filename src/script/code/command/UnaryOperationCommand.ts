import {Command} from "./Command";

import {Definition} from "./../Definition";

import * as Utils from "./../util/Utils";

export class UnaryOperationCommand extends Command {
    constructor(line: number, column: number, private definition: Definition, private symbol: string, private valueArg: Command) {
        super(line, column, definition.type.toDistinctType().param,
            (scope) => {
                return scope.invoke(definition.name, {
                    value: valueArg.execute(scope),
                });
            }, () => `${symbol}${valueArg.describe()}`);
    }

    toString(): string {
        return `UnaryOperationCommand(${Utils.toEscapedStringWithQuotes(this.definition.name)}, ${Utils.describe({
            value: this.valueArg
        })})`;
    }
}
