import {Command} from "./../Command";
import {Definition} from "./../Definition";
import {Type} from "./../Type";

import * as Utils from "./../Utils";

export class AccessCommand extends Command {
    constructor(line: number, column: number, type: Type, private name: string) {
        super(line, column, type, (scope) => {
            return scope.get(name);
        }, (accent) => `${name}`);
    };

    toString(): string {
        return `AccessCommand(${Utils.toEscapedStringWithQuotes(this.name)})`;
    }
}

