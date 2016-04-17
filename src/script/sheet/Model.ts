import {Identable} from "./../Utils";

export interface Action extends Identable {

    updates?: { [key: string]: any };

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

export function findIdentable(sheet: Sheet, id: number): Sheet | Line | Instruction {
    if (id === sheet.$id) {
        return sheet;
    }

    for (let line of sheet.lines) {
        if (line) {
            let identable = findIdentableInLine(line, id);

            if (identable) {
                return identable;
            }
        }
    }

    return null;
}

function findIdentableInLine(line: Line, id: number): Line | Instruction {
    if (id === line.$id) {
        return line;
    }

    if (line.instruction) {
        let identable = findIdentableInArgument(line.instruction, id);

        if (identable) {
            return identable;
        }
    }

    return null;
}

function findIdentableInArgument(argument: Argument, id: number): Instruction {
    if (typeof argument !== "object") {
        return;
    }

    return findIdentableInInstruction(argument as Instruction, id);
}

function findIdentableInInstruction(instruction: Instruction, id: number): Instruction {
    if (id === instruction.$id) {
        return instruction;
    }

    for (let key in instruction) {
        let identable = findIdentableInArgument(instruction[key], id);

        if (identable) {
            return identable;
        }
    }

    return null;
}

export function ensureIdentable(sheet: Sheet): Sheet {
    if (!sheet.$id) {
        sheet.$id = globalId++;
    }

    for (let line of sheet.lines) {
        if (line) {
            ensureIdentableInLine(line);
        }
    }

    return sheet;
}

function ensureIdentableInLine(line: Line): void {
    if (!line.$id) {
        line.$id = globalId++;
    }

    if (line.instruction) {
        ensureIdentableInArgument(line.instruction);
    }
}

function ensureIdentableInArgument(argument: Argument): void {
    if (typeof argument !== "object") {
        return;
    }

    ensureIdentableInInstruction(argument as Instruction);
}

function ensureIdentableInInstruction(instruction: Instruction): void {
    if (!(instruction.$id)) {
        instruction.$id = globalId++;
    }

    for (let key in instruction) {
        ensureIdentableInArgument(instruction[key]);
    }
}
