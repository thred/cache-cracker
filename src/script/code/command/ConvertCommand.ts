import {Command} from "./Command";

import {Types} from "./../Type";
import {Unit} from "./../Unit";

export class ConvertCommand extends Command {
    constructor(line: number, column: number, private valueArg: Command, private unit: Unit) {
        super(line, column, Types.QUANTITY,
            (scope) => {
                return scope.invoke("convert", {
                    value: valueArg.execute(scope),
                    unit: unit
                });
            }, () => `${valueArg.describe()} ${unit.symbols[0]}`);
    }

    toString(): string {
        return `ConvertCommand(${this.valueArg}, ${this.unit.symbols[0]})`;
    }
}

