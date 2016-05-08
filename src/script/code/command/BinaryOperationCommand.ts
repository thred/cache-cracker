import {Command} from "./Command";

import {Definition} from "./../Definition";
import {Procedure} from "./../Procedure";

import * as Utils from "./../util/Utils";

export class BinaryOperationCommand extends Command {
    constructor(line: number, column: number, private definition: Definition, private symbol: string, private leftArg: Command, private rightArg: Command) {
        super(line, column, definition.type.toDistinctType().param,
            (scope) => {
                return scope.invoke(definition.name, {
                    left: leftArg.execute(scope),
                    right: rightArg.execute(scope)
                });
            }, () => `${leftArg.describe()} ${symbol} ${rightArg.describe()}`);

        // let procedure: Procedure = definition.initialValue();

        //FIXME check params
        // if ((procedure.params))
        //     if (!definition.)
    }

    toString(): string {
        return `BinaryOperation(${Utils.toEscapedStringWithQuotes(this.definition.name)}, ${Utils.describe({
            left: this.leftArg,
            right: this.rightArg
        })})`;
    }
}

