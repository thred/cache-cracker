import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

export class OperationError extends Error {

    constructor(private _message: string) {
        super(_message);
    }

}

export function concat(values: any[]): string {
    return values.join("");
}

export function positive(value: any): any {

}

export function negative(value: any): any {

}

export function convert(value: any, unit: Unit): any {
    console.log(`Converting ${value} in ${unit.symbol}`);
    if (value instanceof Quantity) {
        return (value as Quantity).convert(unit);
    }

    //FIME unit.symbol. wirft NPE
    throw new OperationError(`Conversion of ${value} in unit ${unit.symbol} not supported`);
}

export function add(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).add(right);
        }
    }

    throw new OperationError(`Add not supported for ${left} and ${right}`);
}

export function subtract(left: any, right: any): any {

}

export function multiply(left: any, right: any): any {

}

export function divide(left: any, right: any): any {

}

export function modulo(left: any, right: any): any {

}