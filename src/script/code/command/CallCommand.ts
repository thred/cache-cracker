import {BlockCommand} from "./BlockCommand";
import {Command} from "./Command";

import {Definition} from "./../Definition";
import {Procedure} from "./../Procedure";
import {Type, Types} from "./../Type";

import {Context} from "./../util/Context";

import * as Utils from "./../util/Utils";

export class CallCommand extends BlockCommand {
    constructor(line: number, column: number, context: Context, private definition: Definition, private arg: Command) {
        super(line, column, definition.type.toDistinctType().param, context, (scope) => {
            try {
                return scope.requiredAsProcedure(definition.name).invoke(scope, arg.execute(scope));
            }
            catch (error) {
                throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${definition.name}`, error));
            }
        }, (language?: string) => `${definition.name} ${this.arg.describe(language)}`);
    };

    toString(): string {
        return `CallCommand(${Utils.toEscapedStringWithQuotes(this.definition.name)}, ${this.arg})`;
    }
}
