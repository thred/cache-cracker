import {Unit} from "./Unit";

export abstract class Quantity {

    constructor(private _unit: Unit) {

    }

    get unit() {
        return this._unit;
    }

    abstract convert(unit: Unit): Quantity;

    abstract add(other: Quantity): Quantity;
}

export class QuantityError extends Error {

    constructor(private _message: string) {
        super(_message);
    }

}


export class NumberBasedQuantity extends Quantity {

    constructor(private _value: number, unit?: Unit) {
        super(unit);
    }

    get value() {
        return this._value;
    }

    protected create(value: number, unit: Unit): NumberBasedQuantity {
        return new NumberBasedQuantity(value, unit);
    }

    convert(unit: Unit): Quantity {
        if (!this.unit) {
            return this.create(this.value, unit);
        }

        if (this.unit.typeOfMeasurement === unit.typeOfMeasurement) {
            return this.create((this.value * this.unit.multiplier) / unit.multiplier, unit);
        }
        //FIXME this.unit.symbol wirft NPE wenn undefined
        throw new QuantityError(`Conversion of unit ${this.unit.symbol} in unit ${unit.symbol} not supported`);
    }

    add(other: Quantity): Quantity {
        if (other instanceof NumberBasedQuantity) {
            let otherValue = (other as NumberBasedQuantity).value;

            if ((!this.unit) || (!other.unit)) {
                return this.create(this.value + otherValue, this.unit);
            }

            if (this.unit.typeOfMeasurement === other.unit.typeOfMeasurement) {
                return this.create((this.value * this.unit.multiplier + otherValue * other.unit.multiplier) / this.unit.multiplier, this.unit);
            }
        }

        throw new QuantityError(`Addition of units ${this.unit.symbol} and ${other.unit.symbol} not supported`);
    }

    toString(): string {
        if (!this.unit) {
            return `${this.value}`;
        }

        return `${this.value} ${this.unit.symbol}`;
    }

}