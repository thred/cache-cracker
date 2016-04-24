import {TypeOfMeasurement, Unit} from "./Unit";

const UNITS: Unit[] = [];
const UNITS_BY_SYMBOL: { [symbol: string]: Unit } = {};

// Undefined

export const UNDEFINED = new Unit("undefined", "Undefined", TypeOfMeasurement.Undefined, 1); // not registered!

// Units of length

export const MICROMETER = aUnitOfLength("µm", "Micrometer", 0.0001);

export const MILLIMETER = aUnitOfLength("mm", "Millimeter", 0.001);

export const CENTIMETER = aUnitOfLength("cm", "Centimeter", 0.01, MILLIMETER);

export const DECIMETER = aUnitOfLength("dm", "Decimeter", 0.1);

export const METER = aUnitOfLength("m", "Meter", 1, CENTIMETER);

export const DEGAMETER = aUnitOfLength("dam", "Degameter", 10);

export const HECTOMETER = aUnitOfLength("hm", "Hectometer", 100);

export const KILOMETER = aUnitOfLength("km", "Kilometer", 1000, METER);

export const THOUSANDTH_OF_AN_INCH_US = aUnitOfLength("mil", "Thousandth of an inch", 0.0254 / 1000);

export const THOUSANDTH_OF_AN_INCH = aUnitOfLength("thou", "Thousandth of an inch", 0.0254 / 1000);

export const INCH = aUnitOfLength("in", "Inch", 0.0254, THOUSANDTH_OF_AN_INCH_US);

export const FOOT = aUnitOfLength("ft", "Foot", 0.3048, INCH);

export const YARD = aUnitOfLength("yd", "Yard", 0.9144, FOOT);

export const MILE = aUnitOfLength("mi", "Mile", 1609.344, YARD);

// Units of area

export const SQUARE_MICROMETER = aUnitOfArea("µm²", "Square Micrometer", MICROMETER);

export const SQUARE_MILLIMETER = aUnitOfArea("mm²", "Square Millimeter", MILLIMETER);

export const SQUARE_CENTIMETER = aUnitOfArea("cm²", "Square Centimeter", CENTIMETER);

export const SQUARE_DECIMETER = aUnitOfArea("dm²", "Square Decimeter", DECIMETER);

export const SQUARE_METER = aUnitOfArea("m²", "Square Meter", METER);

export const SQUARE_DEGAMETER = aUnitOfArea("dam²", "Square Degameter", DEGAMETER);

export const SQUARE_HECTOMETER = aUnitOfArea("hm²", "Square Hectometer", HECTOMETER);

export const SQUARE_KILOMETER = aUnitOfArea("km²", "Square Kilometer", KILOMETER);

export const SQUARE_THOUSANDTH_OF_AN_INCH_US = aUnitOfArea("mil²", "Square Thousandth of an inch", THOUSANDTH_OF_AN_INCH_US);

export const SQUARE_THOUSANDTH_OF_AN_INCH = aUnitOfArea("thou²", "Square Thousandth of an inch", THOUSANDTH_OF_AN_INCH);

export const SQUARE_INCH = aUnitOfArea("in²", "Square Inch", INCH);

export const SQUARE_FOOT = aUnitOfArea("ft²", "Square Foot", FOOT);

export const SQUARE_YARD = aUnitOfArea("yd²", "Square Yard", YARD);

export const SQUARE_MILE = aUnitOfArea("mi²", "Square Mile", MILE);

// Units of volume

export const QUBIC_MICROMETER = aUnitOfVolume("µm³", "Qubic Micrometer", MICROMETER);

export const QUBIC_MILLIMETER = aUnitOfVolume("mm³", "Qubic Millimeter", MILLIMETER);

export const QUBIC_CENTIMETER = aUnitOfVolume("cm³", "Qubic Centimeter", CENTIMETER);

export const QUBIC_DECIMETER = aUnitOfVolume("dm³", "Qubic Decimeter", DECIMETER);

export const QUBIC_METER = aUnitOfVolume("m³", "Qubic Meter", METER);

export const QUBIC_DEGAMETER = aUnitOfVolume("dam³", "Qubic Degameter", DEGAMETER);

export const QUBIC_HECTOMETER = aUnitOfVolume("hm³", "Qubic Hectometer", HECTOMETER);

export const QUBIC_KILOMETER = aUnitOfVolume("km³", "Qubic Kilometer", KILOMETER);

export const QUBIC_THOUSANDTH_OF_AN_INCH_US = aUnitOfVolume("mil³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH_US);

export const QUBIC_THOUSANDTH_OF_AN_INCH = aUnitOfVolume("thou³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH);

export const QUBIC_INCH = aUnitOfVolume("in³", "Qubic Inch", INCH);

export const QUBIC_FOOT = aUnitOfVolume("ft³", "Qubic Foot", FOOT);

export const QUBIC_YARD = aUnitOfVolume("yd³", "Qubic Yard", YARD);

export const QUBIC_MILE = aUnitOfVolume("mi³", "Qubic Mile", MILE);

// Angle

export const SECOND_OF_ARC = aUnitOfAngle("\"", "Second of Arc", 1 / 3600);

export const MINUTE_OF_ARC = aUnitOfAngle("\'", "Minute of Arc", 1 / 60);

export const DEGREE = aUnitOfAngle("°", "Degree", 1);

function register(unit: Unit): Unit {
    UNITS.push(unit);
    UNITS_BY_SYMBOL[unit.symbol] = unit

    return unit;
}

export function get(symbol: string): Unit {
    return UNITS_BY_SYMBOL[symbol];
}

export function find(accept: (unit: Unit) => boolean) {
    for (let unit of UNITS) {
        if (accept(unit)) {
            return unit;
        }
    }

    return null;
}

export function exists(symbol: string): boolean {
    return !!UNITS_BY_SYMBOL[symbol];
}

function aUnitOfLength(symbol: string, name: string, inMetersMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Length, inMetersMultiplier, subUnit));
}

function aUnitOfArea(symbol: string, name: string, baseUnit: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Area, baseUnit.multiplier * baseUnit.multiplier,
        find((unit) => (unit.dimension === 2) && (unit.baseUnit === baseUnit.subUnit)), baseUnit, 2));
}

function aUnitOfVolume(symbol: string, name: string, baseUnit: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Volume, baseUnit.multiplier * baseUnit.multiplier * baseUnit.multiplier,
        find((unit) => (unit.dimension === 3) && (unit.baseUnit === baseUnit.subUnit)), baseUnit, 3));
}

function aUnitOfAngle(symbol: string, name: string, inDegreesMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Angle, inDegreesMultiplier, subUnit));
}