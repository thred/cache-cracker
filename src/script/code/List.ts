export class List {

    constructor(private values: any[] = []) {
    }

    add(value: any): void {
        this.values.push(value);
    }

    get(index: number): any {
        return this.values[index];
    }

    forEach(callbackfn: (value: any, index: number, array: any[]) => void): void {
        this.values.forEach(callbackfn);
    }

    join(separator?: string): string {
        return this.values.join(separator);
    }

    set(index: number, value: any): void {
        this.values[index] = value;
    }

    get size(): number {
        return this.values.length;
    }
}