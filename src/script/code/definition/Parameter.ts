import {Definition} from "./Definition";

export class Parameter extends Definition {

    constructor(name: string, description: string, initialValue?: any) {
        super(name, description, initialValue);
    }

    describe(language?: string): string {
        return `${name}: ${this.description}`;
    }
}
