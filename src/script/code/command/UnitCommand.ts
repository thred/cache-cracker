import {Command} from "./Command";

import {Unit} from "./../Unit";

export class UnitCommand extends Command {
    constructor(line: number, column: number, private unit: Unit) {
        super(line, column,
            (scope) => unit,
            () => `${unit.symbols[0]}`);
    }

    toString(): string {
        return `UnitCommand(${this.unit.symbols[0]})`;
    }
}
