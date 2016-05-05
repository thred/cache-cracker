import {Command} from "./Command";

import {Quantity} from "./../Quantity";

export class QuantityCommand extends Command {
    constructor(line: number, column: number, private value: Quantity) {
        super(line, column,
            (scope) => value,
            () => `${value}`);
    }

    toString(): string {
        return `QuantityCommand(${this.value})`;
    }
}
