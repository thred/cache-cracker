import {Quantity} from "./Quantity";
import {Unit} from "./Unit";

export function noop(value: any): any {
    return value;
}

export function concat(values: any[]): string {
    return values.join("");
}

export function negate(value: any): any {
    if (value instanceof Quantity) {
        return (value as Quantity).negate();
    }

    throw new Error(`Sign not supported: -${value}`);
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
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).chain(right);
        }
    }

    throw new Error(`Chaining of ${left} and ${right} not supported`);
}

export function add(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).add(right);
        }
    }

    throw new Error(`${left} + ${right} not supported`);
}

export function subtract(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).subtract(right);
        }
    }

    throw new Error(`${left} - ${right} not supported`);
}

export function multiply(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).multiply(right);
        }
    }

    throw new Error(`${left} * ${right} not supported`);
}

export function divide(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).divide(right);
        }
    }

    throw new Error(`${left} / ${right} not supported`);
}

export function power(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).power(right);
        }
    }

    throw new Error(`${left} ^ ${right} not supported`);
}

export function modulo(left: any, right: any): any {
    if (left instanceof Quantity) {
        if (right instanceof Quantity) {
            return (left as Quantity).modulo(right);
        }
    }

    throw new Error(`${left} mod ${right} not supported`);
}