import {BlockCommand} from "./command/BlockCommand";
import {Command} from "./command/Command";

import {Context} from "./util/Context";

import * as Utils from "./util/Utils";

export class Script implements Utils.Descripted {

    constructor(private context: Context, private command: Command) {
    }

    execute(): any {
        let scope = this.context.createScope();

        return this.command.execute(scope);
    }

    describe(language: string = Utils.language): string {
        return this.command.describe(language);
    }

    toString(): string {
        return `Script(${this.command})`;
    }
}