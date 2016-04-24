import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

export function concat(values: any[]): string {
    return values.join("");
}

export function positive(value: any): any {
    if (value instanceof Quantity) {
        return (value as Quantity).positive();
    }

    throw new Error(`Sign not supported: +${value}`);
}

export function negative(value: any): any {
    if (value instanceof Quantity) {
        return (value as Quantity).negative();
    }

    throw new Error(`Sign not supported: -${value}`);
}

export function convert(value: any, unit: Unit): any {
    if (value instanceof Quantity) {
        return (value as Quantity).convert(unit);
    }

    throw new Error(`Conversion of ${value} in unit ${unit.symbol} not supported`);
}

export function add(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).add(right);
        }
    }

    throw new Error(`Addition not supported: ${left} + ${right}`);
}

export function subtract(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).subtract(right);
        }
    }

    throw new Error(`Subtraction not supported: ${left} - ${right}`);
}

export function multiply(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).multiply(right);
        }
    }

    throw new Error(`Multiplication not supported: ${left} * ${right}`);
}

export function divide(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).divide(right);
        }
    }

    throw new Error(`Division not supported: ${left} / ${right}`);
}

export function power(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).power(right);
        }
    }

    throw new Error(`Division not supported: ${left} / ${right}`);
}

export function modulo(left: any, right: any): any {

}