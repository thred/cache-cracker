import {Command} from "./Command";

export class ArrayCommand extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column,
            (scope) => {
                return commands.map((command => command.execute(scope)));
            },
            () => `[${commands.map((command) => command.describe()).join(", ")}]`);
    }

    toString(): string {
        return `ArrayCommand(${this.commands})`;
    }
}
