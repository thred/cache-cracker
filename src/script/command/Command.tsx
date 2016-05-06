import * as React from "react";

import * as Input from "./Input";

import * as SheetModel from "../sheet/Model";

import * as Utils from "../Utils";

const CATEGORIES = ["Input"];

export type Category = "Input";

export enum Type {

    Boolean,

    Number,

    String

}

export interface Definition {

    key: string;

    category: Category;

    resultType: Type;

    componentFactory: (instruction: SheetModel.Instruction, onChange: (action: SheetModel.Action) => any) => any;
}

const DEFINITIONS: Definition[] = [];

export interface Props {
    instruction: SheetModel.Instruction

    onAction: (action: SheetModel.Action) => any;
}

export function register(definition: Definition): void {
    DEFINITIONS.push(definition);
}

export function definition(key: string): Definition {
    for (let definition of DEFINITIONS) {
        if (key === definition.key) {
            return definition;
        }
    }

    return null;
}

export function categories(filter?: (definition: Definition) => boolean): { [category: string]: Definition[] } {
    let results: { [category: string]: Definition[] } = {};
    let definitions = (filter) ? DEFINITIONS.filter((definition) => filter(definition)) : DEFINITIONS;

    for (let category of CATEGORIES) {
        let categoryCommands = definitions.filter((definition) => definition.category === category);

        if (categoryCommands.length) {
            results[category] = categoryCommands;
        }
    }

    return results;
}

Input.initialize();