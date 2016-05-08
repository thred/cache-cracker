import {Command} from "./Command";

import {Types} from "./../Type";
import {Unit} from "./../Unit";

export class UnitCommand extends Command {
    constructor(line: number, column: number, private unit: Unit) {
        super(line, column, Types.UNIT,
            (scope) => unit,
            () => `${unit.symbols[0]}`);
    }

    toString(): string {
        return `UnitCommand(${this.unit.symbols[0]})`;
    }
}
