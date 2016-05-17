import {Command} from "./../Command";
import {Definition} from "./../Definition";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class AssignmentCommand extends Command {
    constructor(line: number, column: number, private name: string, private arg: Command) {
        super(line, column, arg.type, (scope) => {
            let value = arg.execute(scope);

            scope.set(name, value);

            return value;
        }, (accent) => `${name} := ${Utils.toScript(accent, arg)}`);
    };

    toString(): string {
        return `AssignmentCommand(${Utils.toEscapedStringWithQuotes(this.name)}, ${this.arg})`;
    }
}

