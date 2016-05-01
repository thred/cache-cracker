import * as Code from "./Code";

import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

export function noop(value: any): any {
    return value;
}

export function concat(values: any[]): string {
    return values.join("");
}
