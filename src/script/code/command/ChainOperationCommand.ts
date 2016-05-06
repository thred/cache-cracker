import {Command} from "./Command";

import * as Utils from "./../util/Utils";

export class ChainOperationCommand extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column,
            (scope) => {
                return scope.invoke("chain", {
                    values: segments.map((segment) => segment.execute(scope))
                });
            }, () => `${segments.map((segment) => segment.describe()).join(" ")}`);
    }

    toString(): string {
        return `ChainOperationCommand(${this.segments})`;
    }
}


