import {Command} from "./../Command";
import {Definition} from "./../Definition";
import {Procedure} from "./../Procedure";
import {Type} from "./../Type";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class BinaryOperationCommand extends Command {
    constructor(line: number, column: number, type: Type, private name: string, private symbol: string, private leftArg: Command, private rightArg: Command) {
        super(line, column, type,
            (scope) => {
                try {
                    return scope.requiredAsProcedure(name).invoke({
                        leftValue: leftArg.execute(scope),
                        rightValue: rightArg.execute(scope)
                    });
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${name}`, error));
                }
            }, (accent) => `${Utils.toScript(accent, leftArg)} ${symbol} ${Utils.toScript(accent, rightArg)}`);
    }

    toString(): string {
        return `BinaryOperation(${Utils.toEscapedStringWithQuotes(this.name)}, ${{
            left: this.leftArg,
            right: this.rightArg
        }})`;
    }
}

