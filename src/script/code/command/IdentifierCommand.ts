import {Command} from "./Command";

import {Identifier} from "./../Identifier";

export class IdentifierCommand extends Command {
    constructor(line: number, column: number, private identifier: Identifier) {
        super(line, column,
            (scope) => identifier,
            () => `${identifier}`);
    }

    toString(): string {
        return `IdentifierCommand(${this.identifier})`;
    }
}
