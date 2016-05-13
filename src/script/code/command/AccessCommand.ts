import {Command} from "./../Command";
import {Definition} from "./../Definition";

import * as Utils from "./../Utils";

export class AccessCommand extends Command {
    constructor(line: number, column: number, private definition: Definition) {
        super(line, column, definition.type, (scope) => {
            return scope.get(definition.name);
        }, () => `${definition.name}`);
    };

    toString(): string {
        return `AccessCommand(${Utils.toEscapedStringWithQuotes(this.definition.name)})`;
    }
}

