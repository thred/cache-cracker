export interface Identable {

    id?: number;

}

export interface Sheet extends Identable {

    name: string;

    image?: string;

    comment?: string;

    author?: string;

    lines: Line[];

}

export interface Line extends Identable {

    key?: string;

    comment?: string;

    instruction: Instruction;

}

export interface Instruction extends Identable {

    comment?: string;

    definitionKey: string;

    [argument: string]: Argument;

}

export type Argument = boolean | number | string | Instruction;

let globalId: number = 1;

export function ensureIdentableSheet(sheet: Sheet): Sheet {
    if (!sheet.id) {
        sheet.id = globalId++;
    }

    for (let line of sheet.lines) {
        if (line) {
            ensureIdentableLine(line);
        }
    }

    return sheet;
}

function ensureIdentableLine(line: Line): void {
    if (!line.id) {
        line.id = globalId++;
    }

    if (line.instruction) {
        ensureIdentableArgument(line.instruction);
    }
}

function ensureIdentableArgument(argument: Argument): void {
    if (typeof argument !== "object") {
        return;
    }

    ensureIdentableInstruction(argument as Instruction);
}

function ensureIdentableInstruction(instruction: Instruction): void {
    if (!(instruction.id)) {
        instruction.id = globalId++;
    }

    for (let key in instruction) {
        ensureIdentableArgument(instruction[key]);
    }
}
