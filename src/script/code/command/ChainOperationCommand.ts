import {Command} from "./Command";

import {Types} from "./../Type";

import * as Utils from "./../util/Utils";

export class ChainOperationCommand extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column, Types.QUANTITY,
            (scope) => {
                try {
                    return scope.requiredAsProcedure("chain").invoke(scope, {
                        values: segments.map((segment) => segment.execute(scope))
                    });
                }
                catch (error) {
                    throw new Error(Utils.formatError(line, column, `Failed to invoke procedure: ${"chain"}`, error));
                }
            }, () => `${segments.map((segment) => segment.describe()).join(" ")}`);
    }

    toString(): string {
        return `ChainOperationCommand(${this.segments})`;
    }
}


