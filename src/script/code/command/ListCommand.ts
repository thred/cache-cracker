import {Command} from "./Command";

import {List} from "./../List";

export class ListCommand extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column,
            (scope) => {
                return new List(commands.map((command => command.execute(scope))));
            },
            () => `[${commands.map((command) => command.describe()).join(", ")}]`);
    }

    toString(): string {
        return `ListCommand(${this.commands})`;
    }
}
