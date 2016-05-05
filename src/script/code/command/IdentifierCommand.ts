import {Command} from "./Command";

export class IdentifierCommand extends Command {
    constructor(line: number, column: number, private identifier: string) {
        super(line, column,
            (scope) => identifier,
            () => `${identifier}`);
    }

    toString(): string {
        return `IdentifierCommand(${this.identifier})`;
    }
}
