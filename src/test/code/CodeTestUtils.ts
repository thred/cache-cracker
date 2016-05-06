/// <reference path="../imports.d.ts" />

import {Environment} from "../../script/code/Environment";
import {Scope} from "../../script/code/Scope";

import {assert} from "chai";

export function testScript(source: string, expected: string, verify?: (value: any, error?: any) => boolean): Scope {
    let scope = new Scope(null);

    it(`${source} => ${expected}`, () => {
        let description = source;

        if (source.indexOf(":") >= 0) {
            description = source.substring(source.indexOf(":") + 1).trim();
            source = source.substring(0, source.indexOf(":")).trim();
        }

        let script = Environment.DEFAULT.parse(source);

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

    return scope;
}


