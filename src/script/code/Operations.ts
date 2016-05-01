import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

import * as Code from "./Code";

export function noop(value: any): any {
    return value;
}

export function concat(values: any[]): string {
    return values.join("");
}
