import {Unit} from "./Unit";
import * as Units from "./Units";

export abstract class Quantity {

    constructor(private _unit: Unit = Units.UNDEFINED) {
    }

    get unit() {
        return this._unit;
    }

    abstract positive(): Quantity;

    abstract negative(): Quantity;

    abstract convert(unit: Unit): Quantity;

    abstract add(other: Quantity): Quantity;

    abstract subtract(other: Quantity): Quantity;

    abstract multiply(other: Quantity): Quantity;

    abstract divide(other: Quantity): Quantity;

    abstract power(other: Quantity): Quantity;

    abstract modulo(other: Quantity): Quantity;
}

export class NumberBasedQuantity extends Quantity {

    constructor(private _value: number, unit?: Unit) {
        super(unit);
    }

    get value() {
        return this._value;
    }

    protected create(value: number, unit?: Unit): NumberBasedQuantity {
        return new NumberBasedQuantity(value, unit);
    }

    positive(): Quantity {
        return this;
    }

    negative(): Quantity {
        return this.create(-this.value, this.unit);
    }

    convert(unit: Unit): Quantity {
        if ((this.unit.isUndefined()) || (unit.isUndefined())) {
            return this.create(this.value, unit);
        }

        if (this.unit.isCompatible(unit)) {
            return this.create((this.value * this.unit.multiplier) / unit.multiplier, unit);
        }

        throw new Error(`Conversion of ${this.describe()} in ${unit.symbol} not supported`);
    }

    add(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((this.unit.isUndefined()) || (other.unit.isUndefined())) {
                return this.create(this.value + otherValue, this.unit);
            }

            if (this.unit.isCompatible(other.unit)) {
                return this.create((this.value * this.unit.multiplier + otherValue * other.unit.multiplier) / this.unit.multiplier, this.unit);
            }
        }

        throw new Error(`${this.describe()} + ${other} not supported`);
    }

    subtract(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((this.unit.isUndefined()) || (other.unit.isUndefined())) {
                return this.create(this.value - otherValue, this.unit);
            }

            if (this.unit.isCompatible(other.unit)) {
                return this.create((this.value * this.unit.multiplier - otherValue * other.unit.multiplier) / this.unit.multiplier, this.unit);
            }
        }

        throw new Error(`${this.describe()} - ${other} not supported`);
    }

    multiply(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((this.unit.isUndefined()) || (other.unit.isUndefined())) {
                return this.create(this.value * otherValue, this.unit);
            }

            if (!this.unit.baseUnit.isCompatible(other.unit.baseUnit)) {
                throw new Error(`${this.describe()} * ${(other as NumberBasedQuantity).describe()} not supported`);
            }

            let dimension = this.unit.dimension + other.unit.dimension;
            let unit = Units.find((unit) => (unit.baseUnit === this.unit.baseUnit) && (unit.dimension === dimension));

            if (!unit) {
                throw new Error(`Unit "${this.unit.symbol}" with dimension ${dimension} not defined`);
            }

            return this.create((this.value * this.unit.multiplier * otherValue * other.unit.multiplier) / unit.multiplier, unit);
        }

        throw new Error(`${this.describe()} * ${other} not supported`);
    }

    divide(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((this.unit.isUndefined()) || (other.unit.isUndefined())) {
                return this.create(this.value / otherValue, this.unit);
            }

            if (!this.unit.baseUnit.isCompatible(other.unit.baseUnit)) {
                throw new Error(`${this.describe()} / ${(other as NumberBasedQuantity).describe()} not supported`);
            }

            let dimension = this.unit.dimension - other.unit.dimension;
            let unit = Units.find((unit) => (unit.baseUnit === this.unit.baseUnit) && (unit.dimension === dimension));

            if (!unit) {
                throw new Error(`Unit "${this.unit.symbol}" with dimension ${dimension} not defined`);
            }

            return this.create(((this.value * this.unit.multiplier) / (otherValue * other.unit.multiplier)) / unit.multiplier, unit);
        }

        throw new Error(`${this.describe()} / ${other} not supported`);
    }

    power(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((this.unit.isUndefined()) && (other.unit.isUndefined())) {
                return this.create(Math.pow(this.value, otherValue), this.unit);
            }

            if (this.unit.isUndefined()) {
                return this.create(Math.pow(this.value, otherValue), other.unit);
            }

            if (other.unit.isUndefined()) {
                let dimension = this.unit.dimension * otherValue;
                let unit = Units.find((unit) => (unit.baseUnit === this.unit.baseUnit) && (unit.dimension === dimension));

                if (!unit) {
                    throw new Error(`Unit "${this.unit.symbol}" with dimension ${dimension} not defined`);
                }

                return this.create(Math.pow(this.value, otherValue), unit);
            }
        }

        throw new Error(`${this.describe()} ^ ${other} not supported`);
    }

    modulo(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((this.unit.isUndefined()) && (other.unit.isUndefined())) {
                return this.create(this.value % otherValue, this.unit);
            }

            if ((this.unit.isUndefined()) || (other.unit.isUndefined())) {
                throw new Error(`${this.describe()} mod ${(other as NumberBasedQuantity).describe()} not supported`);
            }

            if (!this.unit.baseUnit.isCompatible(other.unit.baseUnit)) {
                throw new Error(`${this.describe()} mod ${(other as NumberBasedQuantity).describe()} not supported`);
            }

            return this.create(((this.value * this.unit.multiplier) % (otherValue * other.unit.multiplier)) / this.unit.multiplier, this.unit);
        }

        throw new Error(`${this.describe()} mod ${other} not supported`);
    }

    describe(): string {
        if (this.unit.isUndefined()) {
            return `${this.value}`;
        }

        return `${this.value} ${this.unit.symbol}`;
    }


    toString(): string {
        return this.describe();
    }

}