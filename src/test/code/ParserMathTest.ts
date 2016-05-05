/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Math)", () => {

    testScript("+2", "2");
    testScript("-2", "-2");

    testScript("1 + 2", "3");
    testScript("3 - 2", "1");

    testScript("2 * 3", "6");
    testScript("6 / 3", "2");

    testScript("4 ^ 3 ^ 2", "262144");

    testScript("3 mod 2", "1");

    testScript("2 * 3 + 4 / 2", "8");
    testScript("2 * (3 + 4) / 2", "7");

    testScript("abs -1.5", "1.5");

    testScript("round 1.5", "2");
    testScript("round (1.555, 2)", "1.56");

    testScript("floor 1.5", "1");
    testScript("ceil 1.5", "2");

});
