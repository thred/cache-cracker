/// <reference path="../imports.d.ts" />

import {Environment} from "../../script/code/Environment";
import {Quantity} from "../../script/code/Quantity";
import {Scope} from "../../script/code/Scope";

import * as Utils from "../../script/code/Utils";

import {assert} from "chai";


export function quantity(language: string, s: string, result: string): void {
    it(`${s} (${language}) => ${result}`, () => {
        let quantity = Quantity.parse(language, s);

        assert.equal(quantity.toString(), result);
    });
}

export function script(source: string, expected: string, verify?: (value: any, error?: any) => boolean): void {
    it(`${Utils.indent(source, "      ")} => ${Utils.indent(expected, "      ")}`, () => {
        let description = source;

        if (source.indexOf(":") >= 0) {
            description = source.substring(source.indexOf(":") + 1).trim();
            source = source.substring(0, source.indexOf(":")).trim();
        }

        let context = Environment.DEFAULT.createContext();
        let scope = context.createScope();
        let script = context.parse(source);

        assert.equal(script.describe(), description);

        try {
            let result = script.execute();

            if (verify) {
                assert.isTrue(verify(result, null), `Verify failed for result ${result.toString()}`);
            }
            else {
                assert.equal(result, expected);
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
    });
}


