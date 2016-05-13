import {Command} from "./../Command";
import {Types} from "./../Type";

import * as Utils from "./../Utils";

export class MapCommand extends Command {
    constructor(line: number, column: number, private commands: {
        key: Command;
        value: Command;
    }[]) {
        super(line, column, Types.MAP,
            (scope) => {
                let map: Utils.Map = {};

                for (let command of commands) {
                    let key = command.key.execute(scope);

                    if ((key === undefined) || (key === null)) {
                        throw new Error(Utils.formatError(command.key.line, command.key.column,
                            `Invalid key: ${key}`));
                    }

                    map[key] = command.value.execute(scope);
                }

                return map;
            },
            () => {
                if (!this.commands.length) {
                    return "{}";
                }

                let description = "{";

                for (let command of commands) {
                    description += "\n\t" + Utils.indent(command.key.describe()) + ": " + Utils.indent(command.value.describe());
                }

                description += "\n}";

                return description;
            });
    }

    toString(): string {
        return `MapCommand(${this.commands})`;
    }
}
