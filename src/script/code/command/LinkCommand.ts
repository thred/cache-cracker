import {Command} from "./../Command";
import {Msg, msg, defMsg} from "./../Msg";
import {Types} from "./../Type";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class LinkCommand extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column, Types.QUANTITY,
            (scope) => {
                try {
                    let args: Utils.Map = {};

                    args[msg(scope.accent, Globals.VAR_LIST)] = segments.map((segment) => segment.execute(scope));

                    return scope.requiredAsProcedure(Globals.PROCEDURE_LINK).invoke(args);
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${msg(scope.accent, Globals.PROCEDURE_LINK)}`, error));
                }
            }, (accent) => `${segments.map((segment) => Utils.toScript(accent, segment)).join(" ")}`);
    }

    toString(): string {
        return `LinkCommand(${this.segments})`;
    }
}


