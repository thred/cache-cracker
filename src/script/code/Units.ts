import {TypeOfMeasurement, Unit} from "./Unit";

const UNITS: Unit[] = [];
const UNITS_BY_SYMBOL: { [symbol: string]: Unit } = {};

// Undefined

export const UNDEFINED = new Unit("undefined", "Undefined", TypeOfMeasurement.Undefined, 1); // not registered!

// As an European, for me this is one of most horrific page on Wikipedia: 
// https://en.wikipedia.org/wiki/United_States_customary_units#Units_of_length

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

export const QUBIC_MICROMETER = aUnitOfLengthBasedVolume("µm³", "Qubic Micrometer", MICROMETER);

export const QUBIC_MILLIMETER = aUnitOfLengthBasedVolume("mm³", "Qubic Millimeter", MILLIMETER);

export const QUBIC_CENTIMETER = aUnitOfLengthBasedVolume("cm³", "Qubic Centimeter", CENTIMETER);

export const QUBIC_DECIMETER = aUnitOfLengthBasedVolume("dm³", "Qubic Decimeter", DECIMETER);

export const QUBIC_METER = aUnitOfLengthBasedVolume("m³", "Qubic Meter", METER);

export const QUBIC_DEGAMETER = aUnitOfLengthBasedVolume("dam³", "Qubic Degameter", DEGAMETER);

export const QUBIC_HECTOMETER = aUnitOfLengthBasedVolume("hm³", "Qubic Hectometer", HECTOMETER);

export const QUBIC_KILOMETER = aUnitOfLengthBasedVolume("km³", "Qubic Kilometer", KILOMETER);

export const QUBIC_THOUSANDTH_OF_AN_INCH_US = aUnitOfLengthBasedVolume("mil³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH_US);

export const QUBIC_THOUSANDTH_OF_AN_INCH = aUnitOfLengthBasedVolume("thou³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH);

export const QUBIC_INCH = aUnitOfLengthBasedVolume("in³", "Qubic Inch", INCH);

export const QUBIC_FOOT = aUnitOfLengthBasedVolume("ft³", "Qubic Foot", FOOT);

export const QUBIC_YARD = aUnitOfLengthBasedVolume("yd³", "Qubic Yard", YARD);

export const QUBIC_MILE = aUnitOfLengthBasedVolume("mi³", "Qubic Mile", MILE);

export const MILLILITRE = aUnitOfVolume("ml", "Millilitre", 0.000001);

export const CENTILITRE = aUnitOfVolume("cl", "Centilitre", 0.00001);

export const DECILITRE = aUnitOfVolume("dl", "Decilitre", 0.0001);

export const LITRE = aUnitOfVolume("l", "Litre", 0.001, MILLILITRE);

export const DECALITRE = aUnitOfVolume("dal", "Decalitre", 0.01);

export const HECTOLITRE = aUnitOfVolume("hl", "Hectolitre", 0.1);

export const KILOLITRE = aUnitOfVolume("kl", "Kilolitre", 1);

// coming from Europe, I just feel sorry for US citizens, sharing a hogshead of tears :(

export const TEASPOON = aUnitOfVolume("Tbsp", "Tablespoon", 4.92892159375 * 0.000001);

export const TABLESPPON = aUnitOfVolume("tsp", "Teaspoon", 14.78676478125 * 0.000001);

export const SHOT = aUnitOfVolume("jig", "Shot", 44.36029434375 * 0.000001);

export const FLUID_OUNCE = aUnitOfVolume("fl_oz", "Fluid Ounce", 29.5735295625 * 0.000001);

export const GILL = aUnitOfVolume("gi", "Gill", 118.29411825 * 0.000001);

export const CUP = aUnitOfVolume("cp", "Cup", 236.5882365 * 0.000001);

export const PINT = aUnitOfVolume("pt", "Pint", 473.176473 * 0.000001);

export const QUART = aUnitOfVolume("qt", "Quart", 0.946352946 * 0.001);

export const GALLON = aUnitOfVolume("gal", "Gallon", 3.785411784 * 0.001);

export const BARREL = aUnitOfVolume("bbl", "Barrel", 119.240471196 * 0.001);

export const OIL_BARREL = aUnitOfVolume("oil_bbl", "Oil Barrel", 158.987294928 * 0.001);

export const HOGSHEAD = aUnitOfVolume("hogshead", "Hogshead", 238.480942392 * 0.001);

export const DRY_PINT = aUnitOfVolume("dry_pt", "Dry Pint", 0.5506105 * 0.001);

export const DRY_QUART = aUnitOfVolume("dry_qa", "Dry Quart", 1.101221 * 0.001);

export const DRY_GALLON = aUnitOfVolume("dry_gal", "Dry Gallon", 4.404884 * 0.001);

// I don't expect that each US citizen knows that a bushel fruits is more than a peck of them.

export const PECK = aUnitOfVolume("pk", "Peck", 8.809768 * 0.001);

export const BUSHEL = aUnitOfVolume("bu", "Bushel", 35.23907 * 0.001);

export const DRY_BARREL = aUnitOfVolume("dry_bbl", "Dry Barrel", 115.6271 * 0.001);

// Time

export const FEMTOSECOND = aUnitOfTime("fs", "Femtosecond", 0.000000000000001);

export const PICOSECOND = aUnitOfTime("ps", "Picosecond", 0.000000000001);

export const NANOSECOND = aUnitOfTime("ns", "Nanosecond", 0.000000001);

export const MICROSECOND = aUnitOfTime("µs", "Microsecond", 0.000001);

export const MILLISECOND = aUnitOfTime("ms", "Millissecond", 0.001);

export const SECOND = aUnitOfTime("s", "Second", 1);

export const MINUTE = aUnitOfTime("min", "Minute", 60);

export const HOUR = aUnitOfTime("h", "Stunde", 60 * 60);

export const DAY = aUnitOfTime("d", "Day", 60 * 60 * 24);

export const YEAR = aUnitOfTime("a", "Year", 60 * 60 * 24 * 365.2425);

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

function aUnitOfLengthBasedVolume(symbol: string, name: string, baseUnit: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Volume, baseUnit.multiplier * baseUnit.multiplier * baseUnit.multiplier,
        find((unit) => (unit.dimension === 3) && (unit.baseUnit === baseUnit.subUnit)), baseUnit, 3));
}

function aUnitOfVolume(symbol: string, name: string, inLitresMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Volume, inLitresMultiplier, subUnit));
}

function aUnitOfTime(symbol: string, name: string, inSecondsMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Time, inSecondsMultiplier, subUnit));
}

function aUnitOfAngle(symbol: string, name: string, inDegreesMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Angle, inDegreesMultiplier, subUnit));
}