import {Command} from "./Command";

import {Types} from "./../Type";

export class ArrayCommand extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column, Types.LIST,
            (scope) => {
                return commands.map((command => command.execute(scope)));
            },
            () => `[${commands.map((command) => command.describe()).join(", ")}]`);
    }

    toString(): string {
        return `ArrayCommand(${this.commands})`;
    }
}
