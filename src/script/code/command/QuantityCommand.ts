import {Command} from "./../Command";
import {Quantity} from "./../Quantity";
import {Types} from "./../Type";

import * as Utils from "./../Utils";

export class QuantityCommand extends Command {
    constructor(line: number, column: number, private value: Quantity) {
        super(line, column, Types.QUANTITY,
            (scope) => value,
            (accent) => `${Utils.toScript(accent, value)}`);
    }

    toString(): string {
        return `QuantityCommand(${this.value})`;
    }
}
