/// <reference path="../imports.d.ts" />

import {Context} from "../../script/code/Context";
import {Environment} from "../../script/code/Environment";
import {Quantity} from "../../script/code/Quantity";
import {Scope} from "../../script/code/Scope";
import {Script} from "../../script/code/Script";

import * as Utils from "../../script/code/Utils";

import {CharacterValueRuleParser} from "../../script/code/parser/CharacterValueRuleParser";

import {assert} from "chai";


export function characterValueRule(s: string, lowerCaseOnly: boolean, expected: { [character: string]: number }): void {
    it(`${s}`, () => {
        let result: { [character: string]: number } = new CharacterValueRuleParser("", s, lowerCaseOnly).parse();

        assert.deepEqual(result, expected);
    });
}

export function quantity(language: string, s: string, expected: string): void {
    it(`${s} (${language}) => ${expected}`, () => {
        let quantity = Quantity.parse(language, s);

        assert.equal(quantity.toString(), expected);
    });
}

export function script(source: string, expected: string, verify?: (value: any, error?: any) => boolean): void {
    it(`${Utils.indent(source, "      ")} => ${Utils.indent(expected, "      ")}`, () => {
        executeScript("", source, expected, verify);
    });
}

export function germanScript(source: string, expected: string, verify?: (value: any, error?: any) => boolean): void {
    it(`${Utils.indent(source, "      ")} => ${Utils.indent(expected, "      ")}`, () => {
        executeScript("de", source, expected, verify);
    });
}

function executeScript(accent: string, source: string, expected: string, verify?: (value: any, error?: any) => boolean): void {
    let description = source;
    let environment: Environment = Environment.createDefault(accent);
    let context: Context = environment.createContext();
    let scope: Scope = context.createScope();
    let script: Script = context.parse(source);

    assert.equal(script.toScript(environment.accent), description);

    try {
        let result = script.execute();

        if (verify) {
            assert.isTrue(verify(result, null), `Verify failed for result ${result.toString()}`);
        }
        else {
            assert.equal(Utils.toScript(environment.accent, result), expected);
        }
    }
    catch (error) {
        if (verify) {
            assert.isTrue(verify(null, error), `Verify failed for error ${error}`);
        }
        else {
            throw error;
        }
    }

}


