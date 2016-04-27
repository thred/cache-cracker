import {Type, Unit} from "./Unit";

const UNITS: Unit[] = [];
const UNITS_BY_SYMBOL: { [symbol: string]: Unit } = {};

// Undefined

export const UNDEFINED = new Unit("undefined", "Undefined", Type.Undefined, 1); // not registered!

// As an European, for me this is one of most horrific page on Wikipedia: 
// https://en.wikipedia.org/wiki/United_States_customary_units

// Units of length

export const MICROMETER = register(new Unit("µm", "Micrometer", Type.Length, 0.0001));

export const MILLIMETER = register(new Unit("mm", "Millimeter", Type.Length, 0.001));

export const CENTIMETER = register(new Unit("cm", "Centimeter", Type.Length, 0.01, MILLIMETER));

export const DECIMETER = register(new Unit("dm", "Decimeter", Type.Length, 0.1));

export const METER = register(new Unit("m", "Meter", Type.Length, 1, CENTIMETER));

export const DEGAMETER = register(new Unit("dam", "Degameter", Type.Length, 10));

export const HECTOMETER = register(new Unit("hm", "Hectometer", Type.Length, 100));

export const KILOMETER = register(new Unit("km", "Kilometer", Type.Length, 1000, METER));

export const THOUSANDTH_OF_AN_INCH_US = register(new Unit("mil", "Thousandth of an inch", Type.Length, 0.0254 / 1000));

export const THOUSANDTH_OF_AN_INCH = register(new Unit("thou", "Thousandth of an inch", Type.Length, 0.0254 / 1000));

export const INCH = register(new Unit("in", "Inch", Type.Length, 0.0254, THOUSANDTH_OF_AN_INCH_US));

export const FOOT = register(new Unit("ft", "Foot", Type.Length, 0.3048, INCH));

export const YARD = register(new Unit("yd", "Yard", Type.Length, 0.9144, FOOT));

export const MILE = register(new Unit("mi", "Mile", Type.Length, 1609.344, YARD));

export const NAUTICAL_MILE = register(new Unit(["nmi", "NM", "M"], "Nautical Mile", Type.Length, 1852));

// Units of area

export const SQUARE_MICROMETER = registerUnitOfAreaBasedOnLength("µm²", "Square Micrometer", MICROMETER);

export const SQUARE_MILLIMETER = registerUnitOfAreaBasedOnLength("mm²", "Square Millimeter", MILLIMETER);

export const SQUARE_CENTIMETER = registerUnitOfAreaBasedOnLength("cm²", "Square Centimeter", CENTIMETER);

export const SQUARE_DECIMETER = registerUnitOfAreaBasedOnLength("dm²", "Square Decimeter", DECIMETER);

export const SQUARE_METER = registerUnitOfAreaBasedOnLength("m²", "Square Meter", METER);

export const SQUARE_DEGAMETER = registerUnitOfAreaBasedOnLength("dam²", "Square Degameter", DEGAMETER);

export const SQUARE_HECTOMETER = registerUnitOfAreaBasedOnLength("hm²", "Square Hectometer", HECTOMETER);

export const SQUARE_KILOMETER = registerUnitOfAreaBasedOnLength("km²", "Square Kilometer", KILOMETER);

export const SQUARE_THOUSANDTH_OF_AN_INCH_US = registerUnitOfAreaBasedOnLength("mil²", "Square Thousandth of an inch", THOUSANDTH_OF_AN_INCH_US);

export const SQUARE_THOUSANDTH_OF_AN_INCH = registerUnitOfAreaBasedOnLength("thou²", "Square Thousandth of an inch", THOUSANDTH_OF_AN_INCH);

export const SQUARE_INCH = registerUnitOfAreaBasedOnLength("in²", "Square Inch", INCH);

export const SQUARE_FOOT = registerUnitOfAreaBasedOnLength("ft²", "Square Foot", FOOT);

export const SQUARE_YARD = registerUnitOfAreaBasedOnLength("yd²", "Square Yard", YARD);

export const SQUARE_MILE = registerUnitOfAreaBasedOnLength("mi²", "Square Mile", MILE);

// Units of volume

export const MILLILITRE = register(new Unit("ml", "Millilitre", Type.Volume, 0.000001));

export const CENTILITRE = register(new Unit("cl", "Centilitre", Type.Volume, 0.00001));

export const DECILITRE = register(new Unit("dl", "Decilitre", Type.Volume, 0.0001));

export const LITRE = register(new Unit("l", "Litre", Type.Volume, 0.001, MILLILITRE));

export const DECALITRE = register(new Unit("dal", "Decalitre", Type.Volume, 0.01));

export const HECTOLITRE = register(new Unit("hl", "Hectolitre", Type.Volume, 0.1));

export const KILOLITRE = register(new Unit("kl", "Kilolitre", Type.Volume, 1));

// coming from Europe, I just feel sorry for US citizens, sharing a hogshead of tears :(

export const TEASPOON = register(new Unit("Tbsp", "Tablespoon", Type.Volume, 4.92892159375 * 0.000001));

export const TABLESPPON = register(new Unit("tsp", "Teaspoon", Type.Volume, 14.78676478125 * 0.000001));

export const SHOT = register(new Unit("jig", "Shot", Type.Volume, 44.36029434375 * 0.000001));

export const FLUID_OUNCE = register(new Unit("fl_oz", "Fluid Ounce", Type.Volume, 29.5735295625 * 0.000001));

export const GILL = register(new Unit("gi", "Gill", Type.Volume, 118.29411825 * 0.000001));

export const CUP = register(new Unit("cp", "Cup", Type.Volume, 236.5882365 * 0.000001));

export const PINT = register(new Unit("pt", "Pint", Type.Volume, 473.176473 * 0.000001));

export const QUART = register(new Unit("qt", "Quart", Type.Volume, 0.946352946 * 0.001));

export const GALLON = register(new Unit("gal", "Gallon", Type.Volume, 3.785411784 * 0.001));

export const BARREL = register(new Unit("bbl", "Barrel", Type.Volume, 119.240471196 * 0.001));

export const OIL_BARREL = register(new Unit("oil_bbl", "Oil Barrel", Type.Volume, 158.987294928 * 0.001));

export const HOGSHEAD = register(new Unit("hogshead", "Hogshead", Type.Volume, 238.480942392 * 0.001));

export const DRY_PINT = register(new Unit("dry_pt", "Dry Pint", Type.Volume, 0.5506105 * 0.001));

export const DRY_QUART = register(new Unit("dry_qa", "Dry Quart", Type.Volume, 1.101221 * 0.001));

export const DRY_GALLON = register(new Unit("dry_gal", "Dry Gallon", Type.Volume, 4.404884 * 0.001));

// I don't expect that each US citizen knows that a bushel fruits is more than a peck of them but less than a hogshead.

export const PECK = register(new Unit("pk", "Peck", Type.Volume, 8.809768 * 0.001));

export const BUSHEL = register(new Unit("bu", "Bushel", Type.Volume, 35.23907 * 0.001));

export const DRY_BARREL = register(new Unit("dry_bbl", "Dry Barrel", Type.Volume, 115.6271 * 0.001));

// Units of volumes based on length

export const QUBIC_MICROMETER = registerUnitOfVolumeBasedOnLength("µm³", "Qubic Micrometer", MICROMETER);

export const QUBIC_MILLIMETER = registerUnitOfVolumeBasedOnLength("mm³", "Qubic Millimeter", MILLIMETER);

export const QUBIC_CENTIMETER = registerUnitOfVolumeBasedOnLength("cm³", "Qubic Centimeter", CENTIMETER);

export const QUBIC_DECIMETER = registerUnitOfVolumeBasedOnLength("dm³", "Qubic Decimeter", DECIMETER);

export const QUBIC_METER = registerUnitOfVolumeBasedOnLength("m³", "Qubic Meter", METER);

export const QUBIC_DEGAMETER = registerUnitOfVolumeBasedOnLength("dam³", "Qubic Degameter", DEGAMETER);

export const QUBIC_HECTOMETER = registerUnitOfVolumeBasedOnLength("hm³", "Qubic Hectometer", HECTOMETER);

export const QUBIC_KILOMETER = registerUnitOfVolumeBasedOnLength("km³", "Qubic Kilometer", KILOMETER);

export const QUBIC_THOUSANDTH_OF_AN_INCH_US = registerUnitOfVolumeBasedOnLength("mil³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH_US);

export const QUBIC_THOUSANDTH_OF_AN_INCH = registerUnitOfVolumeBasedOnLength("thou³", "Qubic Thousandth of an inch", THOUSANDTH_OF_AN_INCH);

export const QUBIC_INCH = registerUnitOfVolumeBasedOnLength("in³", "Qubic Inch", INCH);

export const QUBIC_FOOT = registerUnitOfVolumeBasedOnLength("ft³", "Qubic Foot", FOOT);

export const QUBIC_YARD = registerUnitOfVolumeBasedOnLength("yd³", "Qubic Yard", YARD);

export const QUBIC_MILE = registerUnitOfVolumeBasedOnLength("mi³", "Qubic Mile", MILE);

// Time

export const FEMTOSECOND = register(new Unit("fs", "Femtosecond", Type.Time, 1 / 1000000000000000));

export const PICOSECOND = register(new Unit("ps", "Picosecond", Type.Time, 1 / 1000000000000));

export const NANOSECOND = register(new Unit("ns", "Nanosecond", Type.Time, 1 / 1000000000));

export const MICROSECOND = register(new Unit("µs", "Microsecond", Type.Time, 1 / 1000000));

export const MILLISECOND = register(new Unit("ms", "Millissecond", Type.Time, 1 / 1000));

export const SECOND = register(new Unit("s", "Second", Type.Time, 1));

export const MINUTE = register(new Unit("min", "Minute", Type.Time, 60));

export const HOUR = register(new Unit("h", "Stunde", Type.Time, 60 * 60));

export const DAY = register(new Unit("d", "Day", Type.Time, 60 * 60 * 24));

export const YEAR = register(new Unit("a", "Year", Type.Time, 60 * 60 * 24 * 365.2425));

// Speed 

export const MPH = register(new Unit(["mph", "mi/h"], "Miles per Hour", Type.Speed, MILE.multiplier / HOUR.multiplier, null, [MILE, HOUR]));

export const KNOT = register(new Unit(["kn", "kt"], "Knot", Type.Speed, NAUTICAL_MILE.multiplier / HOUR.multiplier, null, [NAUTICAL_MILE, HOUR]));

findAll((unit) => unit.isOfType(Type.Length)).forEach((unitOfLength) => {
    findAll((unit) => unit.isOfType(Type.Time)).forEach((unitOfTime) => {
        if ((unitOfLength === MILE) && (unitOfTime === HOUR)) {
            return;
        }

        registerUnitOfSpeedBasedOnLengthAndTime(unitOfLength, unitOfTime);
    });
});

// Angle

export const SECOND_OF_ARC = register(new Unit("\"", "Second of Arc", Type.Angle, 1 / 3600));

export const MINUTE_OF_ARC = register(new Unit("\'", "Minute of Arc", Type.Angle, 1 / 60));

export const DEGREE = register(new Unit("°", "Degree", Type.Angle, 1, MINUTE_OF_ARC));

function register(unit: Unit): Unit {
    UNITS.push(unit);

    unit.symbols.forEach((symbol) => {
        if (!UNITS_BY_SYMBOL[symbol]) {
            UNITS_BY_SYMBOL[symbol] = unit;
        }
    });

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

export function findForMultiplicationOf(leftUnit: Unit, rightUnit: Unit) {
    if (leftUnit.isUndefined()) {
        return rightUnit;
    }

    if (rightUnit.isUndefined()) {
        return leftUnit;
    }

    switch (leftUnit.type) {
        case Type.Area:
            if (rightUnit.isOfType(Type.Length)) {
                return find((unit) => (unit.isOfType(Type.Volume)) && (unit.baseUnits[0] === leftUnit.baseUnits[0]));
            }

            break;

        case Type.Length:
            if (rightUnit.isOfType(Type.Area)) {
                return find((unit) => (unit.isOfType(Type.Volume)) && (unit.baseUnits[0] === leftUnit));
            }

            if (rightUnit.isOfType(Type.Length)) {
                return find((unit) => (unit.isOfType(Type.Area)) && (unit.baseUnits[0] === leftUnit));
            }

            break;

        case Type.Speed:
            if (rightUnit.isOfType(Type.Length)) {
                return leftUnit.baseUnits[1];
            }

            if (rightUnit.isOfType(Type.Time)) {
                return leftUnit.baseUnits[0];
            }

            break;
    }

    return null;
}

export function findForDivisionOf(leftUnit: Unit, rightUnit: Unit) {
    if (leftUnit.isUndefined()) {
        return rightUnit;
    }

    if (rightUnit.isUndefined()) {
        return leftUnit;
    }

    if (leftUnit.type === rightUnit.type) {
        return UNDEFINED;
    }

    switch (leftUnit.type) {
        case Type.Area:
            if (rightUnit.isOfType(Type.Length)) {
                return leftUnit.baseUnits[0];
            }

            break;

        case Type.Speed:
            if (rightUnit.isOfType(Type.Time)) {
                return find((unit) => (unit.isOfType(Type.Speed)) && (unit.baseUnits[0] === leftUnit) && (unit.baseUnits[1] === rightUnit));
            }

            break;

        case Type.Volume:
            if (rightUnit.isOfType(Type.Area)) {
                return leftUnit.baseUnits[0];
            }

            if (rightUnit.isOfType(Type.Length)) {
                return find((unit) => (unit.isOfType(Type.Area)) && (unit.baseUnits[0] === leftUnit.baseUnits[0]));
            }

            break;
    }

    return null;
}

export function findForPowerOf(unit: Unit, exponent: number) {
    if (unit.isUndefined()) {
        return UNDEFINED;
    }

    switch (unit.type) {
        case Type.Length:
            if (exponent === 2) {
                return find((unit) => (unit.isOfType(Type.Area)) && (unit.baseUnits[0] === unit));
            }

            if (exponent === 3) {
                return find((unit) => (unit.isOfType(Type.Volume)) && (unit.baseUnits[0] === unit));
            }

            break;
    }

    return null;
}

function registerUnitOfAreaBasedOnLength(symbol: string, name: string, baseUnit: Unit): Unit {
    return register(new Unit(symbol, name, Type.Area, baseUnit.multiplier * baseUnit.multiplier,
        find((unit) => (unit.dimension === 2) && (unit.baseUnits[0] === baseUnit.subUnit)), [baseUnit], 2));
}

function registerUnitOfVolumeBasedOnLength(symbol: string, name: string, baseUnit: Unit): Unit {
    return register(new Unit(symbol, name, Type.Volume, baseUnit.multiplier * baseUnit.multiplier * baseUnit.multiplier,
        find((unit) => (unit.dimension === 3) && (unit.baseUnits[0] === baseUnit.subUnit)), [baseUnit], 3));
}

function registerUnitOfSpeedBasedOnLengthAndTime(unitOfLength: Unit, unitOfTime: Unit): void {
    unitOfLength.symbols.forEach((symbolOfLength) => {
        unitOfTime.symbols.forEach((symbolOfTime) => {
            register(new Unit(`${symbolOfLength}/${symbolOfTime}`, `${unitOfLength.name} per ${unitOfTime.name}`,
                Type.Speed, unitOfLength.multiplier / unitOfTime.multiplier, null, [unitOfLength, unitOfTime]));
        });
    });
}
