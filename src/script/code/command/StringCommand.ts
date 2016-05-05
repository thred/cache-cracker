import {Command} from "./Command";

import * as Utils from "./../util/Utils";

export class StringCommand extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column,
            (scope) => {
                return scope.invoke("concat", {
                    values: segments.map((segment) => segment.execute(scope))
                });
            },
            () => `"${segments.map((segment) => segment.describe()).join("")}"`);
    }

    toString(): string {
        return `StringCommand(${this.segments})`;
    }
}

export class StringCommandReferenceSegment extends Command {
    constructor(line: number, column: number, private name: string) {
        super(line, column,
            (scope) => scope.get(name),
            () => `$${name}`);
    }

    toString(): string {
        return `StringCommandReferenceSegment(${this.name})`;
    }
}

export class StringCommandPlaceholderSegment extends Command {
    constructor(line: number, column: number, private arg: Command) {
        super(line, column,
            (scope) => arg.execute(scope),
            () => `\${${arg.describe()}}`);
    }

    toString(): string {
        return `StringCommandPlaceholderSegment(${this.arg})`;
    }
}

export class StringCommandStringSegment extends Command {
    constructor(line: number, column: number, private s: string) {
        super(line, column,
            (scope) => s,
            () => Utils.toEscapedString(s));
    }

    toString(): string {
        return `StringCommandStringSegment(${this.s})`;
    }
}

