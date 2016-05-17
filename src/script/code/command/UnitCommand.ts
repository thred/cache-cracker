import {Command} from "./../Command";
import {Types} from "./../Type";
import {Unit} from "./../Unit";

import * as Utils from "./../Utils";

export class UnitCommand extends Command {
    constructor(line: number, column: number, private unit: Unit) {
        super(line, column, Types.UNIT,
            (scope) => unit,
            (accent) => `${Utils.toScript(accent, unit)}`);
    }

    toString(): string {
        return `UnitCommand(${this.unit})`;
    }
}
