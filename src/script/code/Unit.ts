export enum Type {
    Undefined,
    Angle,
    Area,
    Length,
    Mass,
    Speed,
    Temperature,
    Time,
    Volume,
};

export class Unit {

    private _symbols: string[];

    constructor(symbols: string | string[], private _name: string, private _type: Type,
        private _multiplier: number, private _subUnit?: Unit, private _baseUnits: Unit[] = [], private _dimension: number = 1) {

        this._symbols = (typeof symbols === "string") ? [symbols] : symbols;
        // this._baseUnits.unshift(this);
    }

    get symbols(): string[] {
        return this._symbols;
    }

    get name(): string {
        return this._name;
    }

    get type(): Type {
        return this._type;
    }

    isOfType(type: Type): boolean {
        return this.type === type;
    }

    get multiplier(): number {
        return this._multiplier;
    }

    get subUnit(): Unit {
        return this._subUnit;
    }

    get baseUnits(): Unit[] {
        return this._baseUnits;
    }

    get dimension(): number {
        return this._dimension;
    }

    isUndefined() {
        return this.type === Type.Undefined;
    }

    isCompatible(unit: Unit) {
        return (this.isUndefined()) || (unit.isUndefined()) || (this.type === unit.type);
    }

    isSame(unit: Unit) {
        return ((this.isUndefined()) && (unit.isUndefined())) || (this.type === unit.type);
    }
    
    isPreceding(unit: Unit) {
        return (!unit.isUndefined()) && (this.isCompatible(unit)) && (unit.multiplier < this.multiplier);
    }

    describe(language?: string): string {
        return this.symbols[0];
    }

}
