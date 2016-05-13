import {Command} from "./Command";
import {Context} from "./Context";
import {Scope} from "./Scope";

import * as Utils from "./Utils";

import {BlockCommand} from "./command/BlockCommand";

export class Script implements Utils.Descripted {

    constructor(private context: Context, private command: Command) {
    }

    createScope(): Scope {
        return this.context.createScope();
    }

    execute(scope: Scope = this.createScope()): any {
        return this.command.execute(scope);
    }

    describe(language: string = Utils.language): string {
        return this.command.describe(language);
    }

    toString(): string {
        return `Script(${this.command})`;
    }
}