import {Command} from "./Command";

import {Context} from "./../Context";
import {Scope} from "./../Scope";
import {Type} from "./../Type";

import * as Utils from "./../util/Utils";

export class BlockCommand extends Command {

    constructor(line: number, column: number, type: Type, impl: (scope: Scope) => any, describe: (language?: string) => string) {
        super(line, column, type, impl, describe);
    }

    execute(scope: Scope): any {
        let childScope = scope.derive();

        return super.execute(childScope);
    }
}