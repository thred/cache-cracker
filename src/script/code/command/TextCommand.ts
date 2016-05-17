import {Command} from "./../Command";
import {Msg, msg, defMsg} from "./../Msg";
import {Types} from "./../Type";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class TextCommand extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column, Types.TEXT,
            (scope) => {
                try {
                    return scope.requiredAsProcedure(Globals.PROCEDURE_CONCAT).invoke({
                        list: segments.map((segment) => segment.execute(scope))
                    });
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${msg(scope.accent, Globals.PROCEDURE_CONCAT)}`, error));
                }
            },
            (accent) => `"${segments.map((segment) => Utils.toScript(accent, segment)).join("")}"`);
    }

    toString(): string {
        return `TextCommand(${this.segments})`;
    }
}

export class TextCommandReferenceSegment extends Command {
    constructor(line: number, column: number, private name: string) {
        super(line, column, Types.ANY,
            (scope) => scope.get(name),
            (accent) => `$${name}`);
    }

    toString(): string {
        return `TextCommandReferenceSegment(${this.name})`;
    }
}

export class TextCommandPlaceholderSegment extends Command {
    constructor(line: number, column: number, private arg: Command) {
        super(line, column, Types.ANY,
            (scope) => arg.execute(scope),
            (accent) => `\${${Utils.toScript(accent, arg)}}`);
    }

    toString(): string {
        return `TextCommandPlaceholderSegment(${this.arg})`;
    }
}

export class TextCommandStringSegment extends Command {
    constructor(line: number, column: number, private s: string) {
        super(line, column, Types.TEXT,
            (scope) => s,
            (accent) => Utils.toEscapedString(s));
    }

    toString(): string {
        return `TextCommandStringSegment(${this.s})`;
    }
}

