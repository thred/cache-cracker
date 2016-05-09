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
            let procedure = definition.initialValue as Procedure;
            let params = procedure.params;

            try {
                return scope.invoke(definition.name, arg.execute(scope));
            }
            catch (error) {
                throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${procedure.describe()}`, error));
            }
        }, (language?: string) => `${definition.name} ${this.arg.describe(language)}`);

        //TODO add checks here
    };

    toString(): string {
        return `CallCommand(${Utils.toEscapedStringWithQuotes(this.definition.name)}, ${this.arg})`;
    }
}
