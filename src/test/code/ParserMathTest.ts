/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (Math)", () => {

    Test.script("+2", "2");
    Test.script("-2", "-2");

    Test.script("1 + 2", "3");
    Test.script("3 - 2", "1");

    Test.script("2 * 3", "6");
    Test.script("6 / 3", "2");

    Test.script("4 ^ 3 ^ 2", "262144");

    Test.script("3 mod 2", "1");

    Test.script("2 * 3 + 4 / 2", "8");
    Test.script("2 * (3 + 4) / 2", "7");

    Test.script("abs -1.5", "1.5");

    Test.script("round 1.5", "2");
    Test.script("round (1.555, 0.01)", "1.56");

    Test.script("floor 1.5", "1");
    Test.script("ceil 1.5", "2");

    Test.script("random 1", "1");
    
    Test.germanScript("-2", "-2");
    Test.germanScript("1 + 2", "3");
    Test.germanScript("würfle 1", "1");

});
