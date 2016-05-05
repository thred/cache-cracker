import {Definition} from "./Definition";

export class Variable extends Definition {

    constructor(name: string, description: string, initialValue?: any) {
        super(name, description, initialValue);
    }

    describe(language?: string): string {
        return `Variable: ${super.describe(language)}`;
    }
}
