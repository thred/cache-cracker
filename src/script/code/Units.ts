import {TypeOfMeasurement, Unit} from "./Unit";

const UNITS: Unit[] = [];
const UNITS_BY_SYMBOL: { [symbol: string]: Unit } = {};

// Undefined

export const UNDEFINED = new Unit("undefined", "Undefined", TypeOfMeasurement.Undefined, 1); // not registered!

// As an European, for me this is one of most horrific page on Wikipedia: 
// https://en.wikipedia.org/wiki/United_States_customary_units

// Units of length

export const MICROMETER = registerUnitOfLength("µm", "Micrometer", 0.0001);

export const MILLIMETER = registerUnitOfLength("mm", "Millimeter", 0.001);

export const CENTIMETER = registerUnitOfLength("cm", "Centimeter", 0.01, MILLIMETER);

export const DECIMETER = registerUnitOfLength("dm", "Decimeter", 0.1);

export const METER = registerUnitOfLength("m", "Meter", 1, CENTIMETER);

export const DEGAMETER = registerUnitOfLength("dam", "Degameter", 10);

export const HECTOMETER = registerUnitOfLength("hm", "Hectometer", 100);

export const KILOMETER = registerUnitOfLength("km", "Kilometer", 1000, METER);

export const THOUSANDTH_OF_AN_INCH_US = registerUnitOfLength("mil", "Thousandth of an inch", 0.0254 / 1000);

export const THOUSANDTH_OF_AN_INCH = registerUnitOfLength("thou", "Thousandth of an inch", 0.0254 / 1000);

export const INCH = registerUnitOfLength("in", "Inch", 0.0254, THOUSANDTH_OF_AN_INCH_US);

export const FOOT = registerUnitOfLength("ft", "Foot", 0.3048, INCH);

export const YARD = registerUnitOfLength("yd", "Yard", 0.9144, FOOT);

export const MILE = registerUnitOfLength("mi", "Mile", 1609.344, YARD);

// Units of area

export const SQUARE_MICROMETER = registerUnitOfArea("µm²", "Square Micrometer", MICROMETER);

export const SQUARE_MILLIMETER = registerUnitOfArea("mm²", "Square Millimeter", MILLIMETER);

export const SQUARE_CENTIMETER = registerUnitOfArea("cm²", "Square Centimeter", CENTIMETER);

export const SQUARE_DECIMETER = registerUnitOfArea("dm²", "Square Decimeter", DECIMETER);

export const SQUARE_METER = registerUnitOfArea("m²", "Square Meter", METER);

export const SQUARE_DEGAMETER = registerUnitOfArea("dam²", "Square Degameter", DEGAMETER);

export const SQUARE_HECTOMETER = registerUnitOfArea("hm²", "Square Hectometer", HECTOMETER);

export const SQUARE_KILOMETER = registerUnitOfArea("km²", "Square Kilometer", KILOMETER);

export const SQUARE_THOUSANDTH_OF_AN_INCH_US = registerUnitOfArea("mil²", "Square Thousandth of an inch", THOUSANDTH_OF_AN_INCH_US);

export const SQUARE_THOUSANDTH_OF_AN_INCH = registerUnitOfArea("thou²", "Square Thousandth of an inch", THOUSANDTH_OF_AN_INCH);

export const SQUARE_INCH = registerUnitOfArea("in²", "Square Inch", INCH);

export const SQUARE_FOOT = registerUnitOfArea("ft²", "Square Foot", FOOT);

export const SQUARE_YARD = registerUnitOfArea("yd²", "Square Yard", YARD);

export const SQUARE_MILE = registerUnitOfArea("mi²", "Square Mile", MILE);

// Units of volume

export const QUBIC_MICROMETER = registerUnitOfVolumeByLength("µm³", "Qubic Micrometer", MICROMETER);

export const QUBIC_MILLIMETER = registerUnitOfVolumeByLength("mm³", "Qubic Millimeter", MILLIMETER);

export const QUBIC_CENTIMETER = registerUnitOfVolumeByLength("cm³", "Qubic Centimeter", CENTIMETER);

export const QUBIC_DECIMETER = registerUnitOfVolumeByLength("dm³", "Qubic Decimeter", DECIMETER);

export const QUBIC_METER = registerUnitOfVolumeByLength("m³", "Qubic Meter", METER);

export const QUBIC_DEGAMETER = registerUnitOfVolumeByLength("dam³", "Qubic Degameter", DEGAMETER);

export const QUBIC_HECTOMETER = registerUnitOfVolumeByLength("hm³", "Qubic Hectometer", HECTOMETER);

export const QUBIC_KILOMETER = registerUnitOfVolumeByLength("km³", "Qubic Kilometer", KILOMETER);

export const QUBIC_THOUSANDTH_OF_AN_INCH_US = registerUnitOfVolumeByLength("mil³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH_US);

export const QUBIC_THOUSANDTH_OF_AN_INCH = registerUnitOfVolumeByLength("thou³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH);

export const QUBIC_INCH = registerUnitOfVolumeByLength("in³", "Qubic Inch", INCH);

export const QUBIC_FOOT = registerUnitOfVolumeByLength("ft³", "Qubic Foot", FOOT);

export const QUBIC_YARD = registerUnitOfVolumeByLength("yd³", "Qubic Yard", YARD);

export const QUBIC_MILE = registerUnitOfVolumeByLength("mi³", "Qubic Mile", MILE);

export const MILLILITRE = registerUnitOfVolume("ml", "Millilitre", 0.000001);

export const CENTILITRE = registerUnitOfVolume("cl", "Centilitre", 0.00001);

export const DECILITRE = registerUnitOfVolume("dl", "Decilitre", 0.0001);

export const LITRE = registerUnitOfVolume("l", "Litre", 0.001, MILLILITRE);

export const DECALITRE = registerUnitOfVolume("dal", "Decalitre", 0.01);

export const HECTOLITRE = registerUnitOfVolume("hl", "Hectolitre", 0.1);

export const KILOLITRE = registerUnitOfVolume("kl", "Kilolitre", 1);

// coming from Europe, I just feel sorry for US citizens, sharing a hogshead of tears :(

export const TEASPOON = registerUnitOfVolume("Tbsp", "Tablespoon", 4.92892159375 * 0.000001);

export const TABLESPPON = registerUnitOfVolume("tsp", "Teaspoon", 14.78676478125 * 0.000001);

export const SHOT = registerUnitOfVolume("jig", "Shot", 44.36029434375 * 0.000001);

export const FLUID_OUNCE = registerUnitOfVolume("fl_oz", "Fluid Ounce", 29.5735295625 * 0.000001);

export const GILL = registerUnitOfVolume("gi", "Gill", 118.29411825 * 0.000001);

export const CUP = registerUnitOfVolume("cp", "Cup", 236.5882365 * 0.000001);

export const PINT = registerUnitOfVolume("pt", "Pint", 473.176473 * 0.000001);

export const QUART = registerUnitOfVolume("qt", "Quart", 0.946352946 * 0.001);

export const GALLON = registerUnitOfVolume("gal", "Gallon", 3.785411784 * 0.001);

export const BARREL = registerUnitOfVolume("bbl", "Barrel", 119.240471196 * 0.001);

export const OIL_BARREL = registerUnitOfVolume("oil_bbl", "Oil Barrel", 158.987294928 * 0.001);

export const HOGSHEAD = registerUnitOfVolume("hogshead", "Hogshead", 238.480942392 * 0.001);

export const DRY_PINT = registerUnitOfVolume("dry_pt", "Dry Pint", 0.5506105 * 0.001);

export const DRY_QUART = registerUnitOfVolume("dry_qa", "Dry Quart", 1.101221 * 0.001);

export const DRY_GALLON = registerUnitOfVolume("dry_gal", "Dry Gallon", 4.404884 * 0.001);

// I don't expect that each US citizen knows that a bushel fruits is more than a peck of them but less than a hogshead.

export const PECK = registerUnitOfVolume("pk", "Peck", 8.809768 * 0.001);

export const BUSHEL = registerUnitOfVolume("bu", "Bushel", 35.23907 * 0.001);

export const DRY_BARREL = registerUnitOfVolume("dry_bbl", "Dry Barrel", 115.6271 * 0.001);

// Time

export const FEMTOSECOND = registerUnitOfTime("fs", "Femtosecond", 0.000000000000001);

export const PICOSECOND = registerUnitOfTime("ps", "Picosecond", 0.000000000001);

export const NANOSECOND = registerUnitOfTime("ns", "Nanosecond", 0.000000001);

export const MICROSECOND = registerUnitOfTime("µs", "Microsecond", 0.000001);

export const MILLISECOND = registerUnitOfTime("ms", "Millissecond", 0.001);

export const SECOND = registerUnitOfTime("s", "Second", 1);

export const MINUTE = registerUnitOfTime("min", "Minute", 60);

export const HOUR = registerUnitOfTime("h", "Stunde", 60 * 60);

export const DAY = registerUnitOfTime("d", "Day", 60 * 60 * 24);

export const YEAR = registerUnitOfTime("a", "Year", 60 * 60 * 24 * 365.2425);

// Speed 

findAll((unit) => unit.typeOfMeasurement === TypeOfMeasurement.Length).forEach((unitOfLength) => {
    findAll((unit) => unit.typeOfMeasurement === TypeOfMeasurement.Time).forEach((unitOfTime) => {
        registerUnitOfSpeedByLengthAndTime(unitOfLength, unitOfTime);
    });
});

registerUnitOfSpeed("mph", "Miles per Hour", MILE.multiplier / HOUR.multiplier);

// Angle

export const SECOND_OF_ARC = registerUnitOfAngle("\"", "Second of Arc", 1 / 3600);

export const MINUTE_OF_ARC = registerUnitOfAngle("\'", "Minute of Arc", 1 / 60);

export const DEGREE = registerUnitOfAngle("°", "Degree", 1);

function register(unit: Unit): Unit {
    UNITS.push(unit);
    UNITS_BY_SYMBOL[unit.symbol] = unit

    return unit;
}

export function get(symbol: string): Unit {
    return UNITS_BY_SYMBOL[symbol];
}

export function find(accept: (unit: Unit) => boolean): Unit {
    for (let unit of UNITS) {
        if (accept(unit)) {
            return unit;
        }
    }

    return null;
}

export function findAll(accept: (unit: Unit) => boolean): Unit[] {
    return UNITS.filter(accept);
}

export function exists(symbol: string): boolean {
    return !!UNITS_BY_SYMBOL[symbol];
}

function registerUnitOfLength(symbol: string, name: string, inMetersMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Length, inMetersMultiplier, subUnit));
}

function registerUnitOfArea(symbol: string, name: string, baseUnit: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Area, baseUnit.multiplier * baseUnit.multiplier,
        find((unit) => (unit.dimension === 2) && (unit.baseUnit === baseUnit.subUnit)), baseUnit, 2));
}

function registerUnitOfVolumeByLength(symbol: string, name: string, baseUnit: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Volume, baseUnit.multiplier * baseUnit.multiplier * baseUnit.multiplier,
        find((unit) => (unit.dimension === 3) && (unit.baseUnit === baseUnit.subUnit)), baseUnit, 3));
}

function registerUnitOfVolume(symbol: string, name: string, inLitresMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Volume, inLitresMultiplier, subUnit));
}

function registerUnitOfTime(symbol: string, name: string, inSecondsMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Time, inSecondsMultiplier, subUnit));
}

function registerUnitOfSpeed(symbol: string, name: string, inMeterPerSecond: number): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Speed, inMeterPerSecond));
}

function registerUnitOfSpeedByLengthAndTime(unitOfLength: Unit, unitOfTime: Unit) {
    return register(new Unit(`${unitOfLength.symbol}/${unitOfTime.symbol}`, `${unitOfLength.name} per ${unitOfTime.name}`,
        TypeOfMeasurement.Speed, unitOfLength.multiplier / unitOfTime.multiplier));
}
function registerUnitOfAngle(symbol: string, name: string, inDegreesMultiplier: number, subUnit?: Unit): Unit {
    return register(new Unit(symbol, name, TypeOfMeasurement.Angle, inDegreesMultiplier, subUnit));
}
