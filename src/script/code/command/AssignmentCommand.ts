import {Command} from "./Command";

import {Definition} from "./../Definition";

import * as Utils from "./../util/Utils";

export class AssignmentCommand extends Command {
    constructor(line: number, column: number, private name: string, private arg: Command) {
        super(line, column, arg.type, (scope) => {
            let value = arg.execute(scope);

            scope.set(name, value);

            return value;
        }, (language?: string) => `${name} := ${Utils.describe(arg, language)}`);
    };

    toString(): string {
        return `AssignmentCommand(${Utils.toEscapedStringWithQuotes(this.name)}, ${this.arg.toString()})`;
    }
}

