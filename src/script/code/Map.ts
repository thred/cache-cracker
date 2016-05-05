import {Command} from "./Command";
import {Scope} from "./Scope";

export class Map {

    constructor(private values: { [key: string]: any } = {}) {
    }

    contains(key: string): boolean {
        return this.values[key] !== undefined;
    }

    get(key: string): any {
        return this.values[key];
    }

    keys() {
        return Object.keys(this.values);
    }

    set(key: string, value: any): void {
        this.values[key] = value;
    }

}