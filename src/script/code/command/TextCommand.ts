import {Command} from "./Command";

import {Types} from "./../Type";

import * as Utils from "./../util/Utils";

export class TextCommand extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column, Types.TEXT,
            (scope) => {
                return scope.invoke("concat", {
                    values: segments.map((segment) => segment.execute(scope))
                });
            },
            () => `"${segments.map((segment) => segment.describe()).join("")}"`);
    }

    toString(): string {
        return `TextCommand(${this.segments})`;
    }
}

export class TextCommandReferenceSegment extends Command {
    constructor(line: number, column: number, private name: string) {
        super(line, column, Types.ANY,
            (scope) => scope.get(name),
            () => `$${name}`);
    }

    toString(): string {
        return `TextCommandReferenceSegment(${this.name})`;
    }
}

export class TextCommandPlaceholderSegment extends Command {
    constructor(line: number, column: number, private arg: Command) {
        super(line, column, Types.ANY,
            (scope) => arg.execute(scope),
            () => `\${${arg.describe()}}`);
    }

    toString(): string {
        return `TextCommandPlaceholderSegment(${this.arg})`;
    }
}

export class TextCommandStringSegment extends Command {
    constructor(line: number, column: number, private s: string) {
        super(line, column, Types.TEXT,
            (scope) => s,
            () => Utils.toEscapedString(s));
    }

    toString(): string {
        return `TextCommandStringSegment(${this.s})`;
    }
}

