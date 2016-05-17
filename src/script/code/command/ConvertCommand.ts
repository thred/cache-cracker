import {Command} from "./../Command";
import {Msg, msg, defMsg} from "./../Msg";
import {Types} from "./../Type";
import {Unit} from "./../Unit";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class ConvertCommand extends Command {
    constructor(line: number, column: number, private valueArg: Command, private unit: Unit) {
        super(line, column, Types.QUANTITY,
            (scope) => {
                try {
                    return scope.requiredAsProcedure(Globals.PROCEDURE_CONVERT).invoke({
                        value: valueArg.execute(scope),
                        unit: unit
                    });
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${msg(scope.accent, Globals.PROCEDURE_CONVERT)}`, error));
                }
            }, (accent) => `${Utils.toScript(accent, valueArg)} ${Utils.toScript(accent, unit)}`);
    }

    toString(): string {
        return `ConvertCommand(${this.valueArg}, ${this.unit})`;
    }
}

