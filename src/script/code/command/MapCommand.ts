import {Command} from "./../Command";
import {Msg, msg, defMsg} from "./../Msg";
import {Types} from "./../Type";

import * as Globals from "./../Globals";
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
                        throw new Error(Utils.formatError(command.key.line, command.key.column, `Invalid key: ${key}`));
                    }

                    map[key] = command.value.execute(scope);
                }

                return map;
            },
            (accent) => {
                if (!this.commands.length) {
                    return "{}";
                }

                return `{\n${commands.map((command) => `\t${Utils.indent(Utils.toScript(accent, command.key))}: ${Utils.indent(Utils.toScript(accent, command.value))}${msg(accent, Globals.SEPARATOR)}`).join("\n")}\n}`;
            });
    }

    toString(): string {
        return `MapCommand(${this.commands})`;
    }
}
