import {Command} from "./Command";

import {Definition} from "./../Definition";
import {Procedure} from "./../Procedure";

import * as Utils from "./../util/Utils";

export class BinaryOperationCommand extends Command {
    constructor(line: number, column: number, private definition: Definition, private symbol: string, private leftArg: Command, private rightArg: Command) {
        super(line, column, definition.type.toDistinctType().param,
            (scope) => {
                try {
                    return scope.requiredAsProcedure(definition.name).invoke(scope, {
                        left: leftArg.execute(scope),
                        right: rightArg.execute(scope)
                    });
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${definition.name}`, error));
                }
            }, () => `${leftArg.describe()} ${symbol} ${rightArg.describe()}`);
    }

    toString(): string {
        return `BinaryOperation(${Utils.toEscapedStringWithQuotes(this.definition.name)}, ${Utils.describe({
            left: this.leftArg,
            right: this.rightArg
        })})`;
    }
}

