import {Unit} from "./Unit";

import * as Globals from "./Globals";
import * as Units from "./Units";
import * as Utils from "./Utils";

import {QuantityParser} from "./parser/QuantityParser";

/**
 * Holds a quantity.
 */
export class Quantity implements Utils.Scripted {

    static ZERO: Quantity = new Quantity(0);

    static ONE: Quantity = new Quantity(1);

    static of(value: number, unit?: Unit) {
        return new Quantity(value, unit);
    }

    static parse(language: string, quantity: Quantity | string): Quantity {
        if (quantity instanceof Quantity) {
            return quantity;
        }

        return new QuantityParser(language, quantity as string).parseSignedQuantity();
    }

    constructor(private _value: number, private _unit: Unit = Units.UNDEFINED) {
    }

    get value() {
        return this._value;
    }

    get unit() {
        return this._unit;
    }

    negate(): Quantity {
        return new Quantity(-this.value, this.unit);
    }

    convert(unit: Unit): Quantity {
        if ((this.unit.isUndefined()) || (unit.isUndefined())) {
            return new Quantity(this.value, unit);
        }

        if (this.unit.isCompatible(unit)) {
            return new Quantity((this.value * this.unit.multiplier) / unit.multiplier, unit);
        }

        throw new Error(`Conversion of ${Utils.toScript(Globals.DEFAULT_ACCENT, this)} in ${Utils.toScript(Globals.DEFAULT_ACCENT, unit)} not supported`);
    }

    chain(other: Quantity): Quantity {
        let otherValue = other.value;

        if (this.unit.isUndefined()) {
            throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} and ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} cannot be chained. The unit is missing`);
        }

        let otherUnit = other.unit;

        if (otherUnit.isUndefined()) {

            if (!this.unit.subUnit) {
                throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} and ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} cannot be chained. The unit does not defined a sub unit`);
            }

            otherUnit = this.unit.subUnit;
        }

        if (!this.unit.isCompatible(otherUnit)) {
            throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} and ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} cannot be chained. The units are not compatible`);
        }

        return new Quantity((this.value * this.unit.multiplier + otherValue * otherUnit.multiplier) / this.unit.multiplier, this.unit);
    }

    add(other: Quantity): Quantity {
        let otherValue = other.value;

        if (other.unit.isUndefined()) {
            return new Quantity(this.value + otherValue, this.unit);
        }

        if (this.unit.isUndefined()) {
            return new Quantity(this.value + otherValue, other.unit);
        }

        if (this.unit.isCompatible(other.unit)) {
            return new Quantity((this.value * this.unit.multiplier + otherValue * other.unit.multiplier) / this.unit.multiplier, this.unit);
        }

        throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} + ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} not supported`);
    }

    subtract(other: Quantity): Quantity {
        let otherValue = other.value;

        if (other.unit.isUndefined()) {
            return new Quantity(this.value - otherValue, this.unit);
        }

        if (this.unit.isUndefined()) {
            return new Quantity(this.value - otherValue, other.unit);
        }

        if (this.unit.isCompatible(other.unit)) {
            return new Quantity((this.value * this.unit.multiplier - otherValue * other.unit.multiplier) / this.unit.multiplier, this.unit);
        }

        throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} - ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} not supported`);
    }

    multiply(other: Quantity): Quantity {
        let otherValue = other.value;

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

        throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} * ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} not supported`);
    }

    divide(other: Quantity): Quantity {
        let otherValue = other.value;

        if (other.unit.isUndefined()) {
            return new Quantity(this.value / otherValue, this.unit);
        }

        if (this.unit.isUndefined()) {
            return new Quantity(this.value / otherValue, other.unit);
        }

        let unit = Units.findForDivisionOf(this.unit, other.unit);

        if (unit) {
            return new Quantity(((this.value * this.unit.multiplier) / (otherValue * other.unit.multiplier)) / unit.multiplier, unit);
        }

        throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} / ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} not supported`);
    }

    power(other: Quantity): Quantity {
        let otherValue = other.value;

        if (other.unit.isUndefined()) {
            let unit = Units.findForPowerOf(this.unit, otherValue);

            if (unit) {
                return new Quantity(Math.pow(this.value, otherValue), unit);
            }
        }

        throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} ^ ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} not supported`);
    }

    modulo(other: Quantity): Quantity {
        let otherValue = other.value;

        if (other.unit.isUndefined()) {
            return new Quantity(this.value % otherValue, this.unit);
        }

        if (this.unit.isUndefined()) {
            return new Quantity(this.value % otherValue, other.unit);
        }

        if (this.unit.isCompatible(other.unit)) {
            return new Quantity(((this.value * this.unit.multiplier) % (otherValue * other.unit.multiplier)) / this.unit.multiplier, this.unit);
        }

        throw new Error(`${Utils.toScript(Globals.DEFAULT_ACCENT, this)} mod ${Utils.toScript(Globals.DEFAULT_ACCENT, other)} not supported`);
    }

    abs(): Quantity {
        return new Quantity(Math.abs(this._value), this._unit);
    }

    round(accuracy: Quantity = Quantity.ONE): Quantity {
        if (accuracy.unit.isUndefined()) {
            return new Quantity(Utils.round(this._value, accuracy.value), this._unit);
        }

        if (this.unit.isCompatible(accuracy._unit)) {
            return new Quantity(Utils.round(this._value, accuracy.value * accuracy.unit.multiplier / this._unit.multiplier), this._unit);
        }

        throw new Error(`Rounding "${Utils.toScript(Globals.DEFAULT_ACCENT, this)}" to "${accuracy.toScript(Globals.DEFAULT_ACCENT)}" not supported`);
    }

    floor(accuracy: Quantity = Quantity.ONE): Quantity {
        if (accuracy.unit.isUndefined()) {
            return new Quantity(Utils.floor(this._value, accuracy.value), this._unit);
        }

        if (this.unit.isCompatible(accuracy._unit)) {
            return new Quantity(Utils.floor(this._value, accuracy.value * accuracy.unit.multiplier / this._unit.multiplier), this._unit);
        }

        throw new Error(`Rounding "${Utils.toScript(Globals.DEFAULT_ACCENT, this)}" to "${accuracy.toScript(Globals.DEFAULT_ACCENT)}" not supported`);
    }

    ceil(accuracy: Quantity = Quantity.ONE): Quantity {
        if (accuracy.unit.isUndefined()) {
            return new Quantity(Utils.ceil(this._value, accuracy.value), this._unit);
        }

        if (this.unit.isCompatible(accuracy._unit)) {
            return new Quantity(Utils.ceil(this._value, accuracy.value * accuracy.unit.multiplier / this._unit.multiplier), this._unit);
        }

        throw new Error(`Rounding "${Utils.toScript(Globals.DEFAULT_ACCENT, this)}" to "${accuracy.toScript(Globals.DEFAULT_ACCENT)}" not supported`);
    }

    equals(other: Quantity): boolean {
        if (!this._unit.isSame(other.unit)) {
            return false;
        }

        let value = this.value * this.unit.multiplier;
        let otherValue = other.value * other.unit.multiplier;

        return value.toPrecision(Utils.precision) === otherValue.toPrecision(Utils.precision);
    }

    toScript(accent: string): string {
        if (this.unit.isUndefined()) {
            return `${parseFloat(this.value.toPrecision(Utils.precision))}`;
        }

        return `${parseFloat(this.value.toPrecision(Utils.precision))} ${Utils.toScript(accent, this.unit)}`;
    }


    toString(): string {
        return Utils.toScript(Globals.DEFAULT_ACCENT, this);
    }

}

