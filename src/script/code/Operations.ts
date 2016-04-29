import * as Code from "./Code";

import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

export function noop(value: any): any {
    return value;
}

export function concat(values: any[]): string {
    return values.join("");
}

export function negate(value: any): any {
    return asQuantity(value).negate();
}

export function convert(value: any, unit: any): any {
    if (value instanceof Quantity) {
        if (unit instanceof Unit) {
            return (value as Quantity).convert(unit);
        }
    }

    throw new Error(`Conversion of ${value} in ${unit.symbol} not supported`);
}

export function chain(left: any, right: any): any {
    return asQuantity(left).chain(asQuantity(right));
}

export function add(left: any, right: any): any {
    return asQuantity(left).add(asQuantity(right));
}

export function subtract(left: any, right: any): any {
    return asQuantity(left).subtract(asQuantity(right));
}

export function multiply(left: any, right: any): any {
    return asQuantity(left).multiply(asQuantity(right));
}

export function divide(left: any, right: any): any {
    return asQuantity(left).divide(asQuantity(right));
}

export function power(left: any, right: any): any {
    return asQuantity(left).power(asQuantity(right));
}

export function modulo(left: any, right: any): any {
    return asQuantity(left).modulo(asQuantity(right));
}

export function asQuantity(value: any): Quantity {
    if (value instanceof Quantity) {
        return value as Quantity;
    }

    if (typeof value === "number") {
        return new Quantity(value);
    }

    if (typeof value === "string") {
        return Quantity.parse(Code.language, value as string);
    }

    throw new Error(`Convert to Quantity failed: ${value}`);
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