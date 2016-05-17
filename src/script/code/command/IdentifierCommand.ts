import {Command} from "./../Command";
import {Types} from "./../Type";

import * as Utils from "./../Utils";

export class IdentifierCommand extends Command {
    constructor(line: number, column: number, private identifier: string) {
        super(line, column, Types.TEXT,
            (scope) => identifier,
            () => `${identifier}`);
    }

    toString(): string {
        return `IdentifierCommand(${Utils.toEscapedStringWithQuotes(this.identifier)})`;
    }
}
