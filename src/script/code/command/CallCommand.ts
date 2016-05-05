import {BlockCommand} from "./BlockCommand";
import {Command} from "./Command";

import {List} from "./../List";
import {Map} from "./../Map";
import {Procedure} from "./../definition/Procedure";

import {Context} from "./../util/Context";

import * as Utils from "./../util/Utils";

export class CallCommand extends BlockCommand {
    constructor(line: number, column: number, context: Context, private procedure: Procedure, private arg: Command) {
        super(line, column, context, (scope) => {
            let params = procedure.params;
            let values = arg.execute(scope);
            let valuesAsMap: Map;

            if (values instanceof Map) {
                valuesAsMap = values as Map;
            }
            else if (values instanceof List) {
                if (values.length > params.length) {
                    throw new Error(Utils.formatError(line, column,
                        `Too many arguments. Procedure only has ${params.length} parameters, not ${values.length} as specified: ${procedure.describe()}`));
                }

                valuesAsMap = new Map();

                for (let index = 0; index < values.length; index++) {
                    valuesAsMap.set(params[index].name, values.get(index, true));
                }
            }
            else {
                if (params.length <= 0) {
                    throw new Error(Utils.formatError(line, column,
                        `Too many arguments. Procedure does not define any parameters: ${procedure.describe()}`));
                }

                valuesAsMap = new Map();
                valuesAsMap.set(params[0].name, values);
            }

            for (let param of params) {
                let name = param.name;
                let value = valuesAsMap.get(name);

                if (value === undefined) {
                    if (param.initialValue === undefined) {
                        throw new Error(Utils.formatError(line, column,
                            `Required parameter "${name}" is missing in procedure call: ${procedure.describe()}`));
                    }
                }
                else {
                    scope.set(name, value);
                }
            }

            return scope.invoke(procedure.name);
        }, () => `${name} ${arg.describe()}`);
    };

    toString(): string {
        return `CallCommand(${Utils.toEscapedStringWithQuotes(this.procedure.name)}, ${this.arg})`;
    }
}
