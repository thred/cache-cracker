import {Command} from "./../Command";
import {Types} from "./../Type";
import {Unit} from "./../Unit";

import * as Utils from "./../Utils";

export class ConvertCommand extends Command {
    constructor(line: number, column: number, private valueArg: Command, private unit: Unit) {
        super(line, column, Types.QUANTITY,
            (scope) => {
                try {
                    return scope.requiredAsProcedure("convert").invoke(scope, {
                        value: valueArg.execute(scope),
                        unit: unit
                    });
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${"convert"}`, error));
                }
            }, () => `${valueArg.describe()} ${unit.symbols[0]}`);
    }

    toString(): string {
        return `ConvertCommand(${this.valueArg}, ${this.unit.symbols[0]})`;
    }
}

