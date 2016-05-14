/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (Quantity of Area)", () => {

    Test.script("1.5 m²", "1.5 m²");
    Test.script("(15000 cm²) m²", "1.5 m²");
    Test.script("1 m² 5000 cm²", "1.5 m²");
    Test.script("1 m² 5000", "1.5 m²");
    Test.script("2 m * 2 m", "4 m²");

});
