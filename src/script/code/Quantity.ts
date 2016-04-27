import {Unit} from "./Unit";
import * as Units from "./Units";

/**
 * Holds a quantity.
 */
export class Quantity {

    constructor(private _value: number, private _unit: Unit = Units.UNDEFINED) {
    }

    get value() {
        return this._value;
    }

    get unit() {
        return this._unit;
    }

    positive(): Quantity {
        return this;
    }

    negative(): Quantity {
        return new Quantity(-this.value, this.unit);
    }

    convert(unit: Unit): Quantity {
        if ((this.unit.isUndefined()) || (unit.isUndefined())) {
            return new Quantity(this.value, unit);
        }

        if (this.unit.isCompatible(unit)) {
            return new Quantity((this.value * this.unit.multiplier) / unit.multiplier, unit);
        }

        throw new Error(`Conversion of ${this.describe()} in ${unit.symbols[0]} not supported`);
    }

    add(other: Quantity): Quantity {
        if (other instanceof Quantity) {
            let otherValue = (other as Quantity).value;

            if (other.unit.isUndefined()) {
                return new Quantity(this.value + otherValue, this.unit);
            }

            if (this.unit.isUndefined()) {
                return new Quantity(this.value + otherValue, other.unit);
            }

            if (this.unit.isCompatible(other.unit)) {
                return new Quantity((this.value * this.unit.multiplier + otherValue * other.unit.multiplier) / this.unit.multiplier, this.unit);
            }
        }

        throw new Error(`${this.describe()} + ${other} not supported`);
    }

    subtract(other: Quantity): Quantity {
        if (other instanceof Quantity) {
            let otherValue = (other as Quantity).value;

            if (other.unit.isUndefined()) {
                return new Quantity(this.value - otherValue, this.unit);
            }

            if (this.unit.isUndefined()) {
                return new Quantity(this.value - otherValue, other.unit);
            }

            if (this.unit.isCompatible(other.unit)) {
                return new Quantity((this.value * this.unit.multiplier - otherValue * other.unit.multiplier) / this.unit.multiplier, this.unit);
            }
        }

        throw new Error(`${this.describe()} - ${other} not supported`);
    }

    multiply(other: Quantity): Quantity {
        if (other instanceof Quantity) {
            let otherValue = (other as Quantity).value;

            if (other.unit.isUndefined()) {
                return new Quantity(this.value * otherValue, this.unit);
            }

            if (this.unit.isUndefined()) {
                return new Quantity(this.value * otherValue, other.unit);
            }

            let unit = Units.findForMultiplicationOf(this.unit, other.unit);

            if (unit) {
                return new Quantity((this.value * this.unit.multiplier * otherValue * other.unit.multiplier) / unit.multiplier, unit);
            }
        }

        throw new Error(`${this.describe()} * ${other} not supported`);
    }

    divide(other: Quantity): Quantity {
        if (other instanceof Quantity) {
            let otherValue = (other as Quantity).value;

            if (other.unit.isUndefined()) {
                return new Quantity(this.value / otherValue, this.unit);
            }

            if (this.unit.isUndefined()) {
                return new Quantity(this.value / otherValue, other.unit);
            }

            let unit = Units.findForMultiplicationOf(this.unit, other.unit);

            if (unit) {
                return new Quantity(((this.value * this.unit.multiplier) / (otherValue * other.unit.multiplier)) / unit.multiplier, unit);
            }
        }

        throw new Error(`${this.describe()} / ${other} not supported`);
    }

    power(other: Quantity): Quantity {
        if (other instanceof Quantity) {
            let otherValue = (other as Quantity).value;

            if (other.unit.isUndefined()) {
                let unit = Units.findForPowerOf(this.unit, otherValue);

                if (unit) {
                    return new Quantity(Math.pow(this.value, otherValue), unit);
                }
            }
        }

        throw new Error(`${this.describe()} ^ ${other} not supported`);
    }

    modulo(other: Quantity): Quantity {
        if (other instanceof Quantity) {
            let otherValue = (other as Quantity).value;

            if (other.unit.isUndefined()) {
                return new Quantity(this.value % otherValue, this.unit);
            }

            if (this.unit.isUndefined()) {
                return new Quantity(this.value % otherValue, other.unit);
            }

            if (this.unit.isCompatible(other.unit)) {
                return new Quantity(((this.value * this.unit.multiplier) % (otherValue * other.unit.multiplier)) / this.unit.multiplier, this.unit);
            }
        }

        throw new Error(`${this.describe()} mod ${other} not supported`);
    }


    describe(): string {
        if (this.unit.isUndefined()) {
            return `${round(this.value, 8)}`;
        }

        return `${round(this.value, 8)} ${this.unit.symbols[0]}`;
    }


    toString(): string {
        return this.describe();
    }

}

function round(n: number, digits: number): number {
    var multiple = Math.pow(10, digits);

    return Math.round(n * multiple) / multiple;
}