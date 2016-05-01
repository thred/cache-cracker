import {Quantity} from "./Quantity";
import {Scope} from "./Scope";

export function asQuantity(language: string, value: any): Quantity {
    if (value instanceof Quantity) {
        return value as Quantity;
    }

    if (typeof value === "number") {
        return new Quantity(value);
    }

    if (typeof value === "string") {
        return Quantity.parse(language, value as string);
    }

    throw new Error(`Convert to Quantity failed: ${value}`);
}
