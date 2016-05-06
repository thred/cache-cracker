import {Command} from "./Command";

import * as Utils from "./../util/Utils";

export class BinaryOperationCommand extends Command {
    constructor(line: number, column: number, private name: string, private symbol: string, private leftArg: Command, private rightArg: Command) {
        super(line, column,
            (scope) => {
                return scope.invoke(name, {
                    left: leftArg.execute(scope),
                    right: rightArg.execute(scope)
                });
            }, () => `${leftArg.describe()} ${symbol} ${rightArg.describe()}`);
    }

    toString(): string {
        return `BinaryOperation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            left: this.leftArg,
            right: this.rightArg
        })})`;
    }
}

