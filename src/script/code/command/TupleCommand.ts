import {Command} from "./../Command";
import {Msg, msg, defMsg} from "./../Msg";
import {Types} from "./../Type";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class TupleCommand extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column, Types.ANY,
            (scope) => {
                if (commands.length === 0) {
                    return null; // FIXME what is an empty Tuple? NULL, NIL, EMPTY, (), [], ... ?
                }

                if (commands.length === 1) {
                    return commands[0].execute(scope);
                }

                return commands.map((command => command.execute(scope)));
            },
            (accent) => `(${commands.map((command) => Utils.toScript(accent, command)).join(`${msg(accent, Globals.SEPARATOR)} `)})`);
    }

    toString(): string {
        return `TupleCommand(${this.commands})`;
    }
}
