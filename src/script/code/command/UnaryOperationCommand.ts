import {Command} from "./../Command";
import {Definition} from "./../Definition";
import {Msg, msg, defMsg} from "./../Msg"; 
import {Type} from "./../Type";

import * as Globals from "./../Globals";
import * as Utils from "./../Utils";

export class UnaryOperationCommand extends Command {
    constructor(line: number, column: number, type: Type, private name: string, private symbol: string, private valueArg: Command) {
        super(line, column, type,
            (scope) => {
                try {
                    let args: Utils.Map = {};

                    args[msg(scope.accent, Globals.VAR_VALUE)] = valueArg.execute(scope);

                    return scope.requiredAsProcedure(name).invoke(args);
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${name}`, error));
                }
            }, (accent) => `${symbol}${Utils.toScript(accent, valueArg)}`);
    }

    toString(): string {
        return `UnaryOperationCommand(${Utils.toEscapedStringWithQuotes(this.name)}, ${{
            value: this.valueArg
        }})`;
    }
}
