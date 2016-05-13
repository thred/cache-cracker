import {Command} from "./../Command";
import {Definition} from "./../Definition";

import * as Utils from "./../Utils";

export class UnaryOperationCommand extends Command {
    constructor(line: number, column: number, private definition: Definition, private symbol: string, private valueArg: Command) {
        super(line, column, definition.type.toDistinctType().param,
            (scope) => {
                try {
                    return scope.requiredAsProcedure(definition.name).invoke(scope, {
                        value: valueArg.execute(scope),
                    });
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${definition.name}`, error));
                }
            }, () => `${symbol}${valueArg.describe()}`);
    }

    toString(): string {
        return `UnaryOperationCommand(${Utils.toEscapedStringWithQuotes(this.definition.name)}, ${Utils.describe({
            value: this.valueArg
        })})`;
    }
}
