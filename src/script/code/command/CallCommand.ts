import {BlockCommand} from "./BlockCommand";

import {Command} from "./../Command";
import {Context} from "./../Context";
import {Definition} from "./../Definition";
import {Procedure} from "./../Procedure";
import {Type, Types} from "./../Type";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class CallCommand extends BlockCommand {
    constructor(line: number, column: number, type: Type, private name: string, private arg: Command) {
        super(line, column, type, (scope) => {
            try {
                return scope.requiredAsProcedure(name).invoke(arg.execute(scope));
            }
            catch (error) {
                throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${name}`, error));
            }
        }, (accent) => `${name} ${Utils.toScript(accent, arg)}`);
    };

    toString(): string {
        return `CallCommand(${Utils.toEscapedStringWithQuotes(this.name)}, ${this.arg})`;
    }
}
