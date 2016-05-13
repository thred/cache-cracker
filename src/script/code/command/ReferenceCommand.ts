import {Command} from "./../Command";
import {Definition} from "./../Definition";
import {Types} from "./../Type";

import * as Utils from "./../Utils";

export class ReferenceCommand extends Command {
    constructor(line: number, column: number, private _definition: Definition) {
        super(line, column, Types.ANY, (scope) => {
            return scope.get(_definition.name);
        }, () => `${_definition.name}`);
    };

    get definition(): Definition {
        return this._definition;
    }

    toString(): string {
        return `ReferenceCommand(${Utils.toEscapedStringWithQuotes(this._definition.name)})`;
    }
}

