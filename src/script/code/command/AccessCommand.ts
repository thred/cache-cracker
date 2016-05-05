import {Command} from "./Command";

import * as Utils from "./../util/Utils";

export class AccessCommand extends Command {
    constructor(line: number, column: number, private name: string) {
        super(line, column, (scope) => {

            throw new Error("Implement me!");

        }, () => `${name}`);
    };

    toString(): string {
        return `AccessCommand(${Utils.toEscapedStringWithQuotes(this.name)})`;
    }
}

