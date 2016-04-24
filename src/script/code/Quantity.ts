import {Unit} from "./Unit";
import * as Units from "./Units";

export abstract class Quantity {

    constructor(private _unit: Unit = Units.UNDEFINED) {
    }

    get unit() {
        return this._unit;
    }

    abstract convert(unit: Unit): Quantity;

    abstract add(other: Quantity): Quantity;

    abstract subtract(other: Quantity): Quantity;

    abstract multiply(other: Quantity): Quantity;
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

    convert(unit: Unit): Quantity {
        if ((this.unit.isUndefined()) || (unit.isUndefined())) {
            return this.create(this.value, unit);
        }

        if (this.unit.isCompatible(unit)) {
            console.log(`(${this.value} * ${this.unit.multiplier}) / ${unit.multiplier} = ${(this.value * this.unit.multiplier) / unit.multiplier}`)
            return this.create((this.value * this.unit.multiplier) / unit.multiplier, unit);
        }

        throw new Error(`Conversion of unit "${this.unit.symbol}" to unit "${unit.symbol}" not supported`);
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

        throw new Error(`Addition of units "${this.unit.symbol}" and "${other.unit.symbol}" not supported`);
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

        throw new Error(`Subtraction of units "${this.unit.symbol}" and "${other.unit.symbol}" not supported`);
    }

    multiply(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((this.unit.isUndefined()) || (other.unit.isUndefined())) {
                return this.create(this.value * otherValue, this.unit);
            }

            if (!this.unit.baseUnit.isCompatible(other.unit.baseUnit)) {
                throw new Error(`Multiplication of units "${this.unit.symbol}" and "${other.unit.symbol}" not supported`);
            }

            let dimension = this.unit.dimension + other.unit.dimension;
            let unit = Units.find((unit) => (unit.baseUnit === this.unit.baseUnit) && (unit.dimension === dimension));

            if (!unit) {
                throw new Error(`Unit "${this.unit.symbol}" with dimension ${dimension} not defined`);
            }

            return this.create((this.value * this.unit.multiplier * otherValue * other.unit.multiplier) / unit.multiplier, unit);
        }

        throw new Error(`Addition of units "${this.unit.symbol}" and "${other.unit.symbol}" not supported`);
    }

    toString(): string {
        if (this.unit.isUndefined()) {
            return `${this.value}`;
        }

        return `${this.value} ${this.unit.symbol}`;
    }

}