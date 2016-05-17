import {Command} from "./../Command";
import {Msg, msg, defMsg} from "./../Msg";
import {Types} from "./../Type";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class ListCommand extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column, Types.LIST,
            (scope) => {
                return commands.map((command => command.execute(scope)));
            },
            (accent) => `[${commands.map((command) => Utils.toScript(accent, command)).join(`${msg(accent, Globals.SEPARATOR)} `)}]`);
    }

    toString(): string {
        return `ListCommand(${this.commands})`;
    }
}
