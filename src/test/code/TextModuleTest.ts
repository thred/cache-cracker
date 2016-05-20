/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (Basic)", () => {

    Test.script("simplifyCharacters \"abc\"", "\"abc\""); // FIXME this should be a useful test

    Test.script("countCharacters \"This is the 1st test.\"", "16");
    Test.script("countCharacters (\"This is the 2nd test.\", \"t\")", "4");
    Test.script("countCharacters (\"This is the 3rd test.\", \"t\", yes)", "3");
    
    Test.script("toCharacterValues \"ABC\"", "[1, 2, 3]");
});
