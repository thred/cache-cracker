import {Command} from "./../Command";
import {Quantity} from "./../Quantity";
import {Types} from "./../Type";

export class QuantityCommand extends Command {
    constructor(line: number, column: number, private value: Quantity) {
        super(line, column, Types.QUANTITY,
            (scope) => value,
            () => `${value}`);
    }

    toString(): string {
        return `QuantityCommand(${this.value})`;
    }
}
