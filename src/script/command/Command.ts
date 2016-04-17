import * as React from "react";

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

    componentFactory: (instruction: SheetModel.Instruction) => JSX.Element;
}


const DEFINITIONS: Definition[] = [];

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

register({
    key: "String",
    category: "Input",
    resultType: Type.String,
    componentFactory: null //(instruction) => <div>lala < /div>
});

register({
    key: "Number",
    category: "Input",
    resultType: Type.Number,
    componentFactory: null
});

register({
    key: "Boolean",
    category: "Input",
    resultType: Type.Boolean,
    componentFactory: null
});