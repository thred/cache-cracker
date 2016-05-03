import {Command} from "./Command";
import {Scope} from "./Scope";

export class List {

    constructor(private scope: Scope, private values: any[] = [], lazy: boolean = false) {
        if (!lazy) {
            for (let index = 0; index < values.length; index++) {
                this.get(index);
            }
        }
    }

    add(value: any): void {
        this.values.push(value);
    }

    get(index: number, lazy: boolean = false): any {
        let value = this.values[index];

        if ((!lazy) && (value instanceof Command)) {
            try {
                value = (value as Command).invoke(this.scope);
            }
            catch (error) {
                throw new Error(`Failed to initialize item ${index} of List: ${error}`);
            }

            this.values[index] = value;
        }

        return value;
    }

    set(index: number, value: any): void {
        this.values[index] = value;
    }

    size(): number {
        return this.values.length;
    }
}