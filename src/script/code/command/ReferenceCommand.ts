import {Command} from "./Command";

import {Definition} from "./../util/Definition";

import * as Utils from "./../util/Utils";

export class ReferenceCommand extends Command {
    constructor(line: number, column: number, private _name: string, private _definition: Definition) {
        super(line, column, (scope) => {
            if ((_definition === undefined) || (_definition === null)) {
                throw new Error(Utils.formatError(line, column, `Undefined reference: ${_name}`));
            }

            return scope.get(name);
        }, () => `${name}`);
    };

    get name(): string {
        return this._name;
    }

    get definition(): Definition {
        return this._definition;
    }

    toString(): string {
        return `ReferenceCommand(${Utils.toEscapedStringWithQuotes(this.name)})`;
    }
}

