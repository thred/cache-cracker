import * as Code from "./Code";

import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

export function noop(value: any): any {
    return value;
}

export function concat(values: any[]): string {
    return values.join("");
}

export function convert(value: any, unit: any): any {
    if (value instanceof Quantity) {
        if (unit instanceof Unit) {
            return (value as Quantity).convert(unit);
        }
    }

    throw new Error(`Conversion of ${value} in ${unit.symbol} not supported`);
}


// export function asUnit(value: any): Unit {
//     if (value instanceof Unit) {
//         return value as Unit;
//     }

//     if (typeof value === "string") {
//         return Unit.parse(Code.language, value as string);
//     }

//     throw new Error(`Convert to Unit failed: ${value}`);
// }