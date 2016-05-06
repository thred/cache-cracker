import {Command} from "./Command";

import {Scope} from "./../Scope";

import {Context} from "./../util/Context";

import * as Utils from "./../util/Utils";

export class BlockCommand extends Command {

    constructor(line: number, column: number, private context: Context, implementation: (scope: Scope) => any, describe: (language?: string) => string) {
        super(line, column, implementation, describe);
    }

    execute(scope: Scope): any {
        let childScope = this.context.createScope(scope);

        return super.execute(childScope);
    }
}