/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (TextModule)", () => {

    Test.script("simplifyCharacters \"ABCabc123ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÐð\"",
        "\"ABCabc123AEIOUaeiouAEIOUYaeiouyAEIOUaeiouANOanoAeEIOeUeaeeioeuecCssOoAaAeaeDd\"");

    Test.script("countCharacters \"This is the 1st test.\"", "16");
    Test.script("countCharacters (\"This is the 2nd test.\", \"t\")", "4");
    Test.script("countCharacters (\"This is the 3rd test.\", \"t\", yes)", "3");

    Test.script("toCharacterValues \"ABC\"", "[1, 2, 3]");
});
