import {Command} from "./Command";
import {Scope} from "./Scope";

export class Map {

    constructor(private scope: Scope, private values: { [key: string]: any } = {}, lazy: boolean = false) {
        if (!lazy) {
            for (let key of Object.keys(values)) {
                this.get(key);
            }
        }
    }

    get(key: string, lazy: boolean = false): any {
        let value = this.values[key];

        if ((!lazy) && (value instanceof Command)) {
            try {
                value = (value as Command).invoke(this.scope);
            }
            catch (error) {
                throw new Error(`Failed to initialize item "${key}" of Map: ${error}`);
            }

            this.values[key] = value;
        }

        return value;
    }

    keys() {
        return Object.keys(this.values);
    }

    set(key: string, value: any): void {
        this.values[key] = value;
    }

}