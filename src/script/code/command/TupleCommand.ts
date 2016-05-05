import {Command} from "./Command";

export class TupleCommand extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column,
            (scope) => {
                if (commands.length === 0) {
                    return null; // FIXME what is an empty Tuple? NULL, NIL, EMPTY, (), [], ... ?
                }

                if (commands.length === 1) {
                    return commands[0].execute(scope);
                }

                return commands.map((command => command.execute(scope)));
            },
            () => `(${commands.map((command) => command.describe()).join(", ")})`);
    }

    toString(): string {
        return `TupleCommand(${this.commands})`;
    }
}
