/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (Quantity of Volume)", () => {

    Test.script("1.5 m³", "1.5 m³");
    Test.script("(1500000 cm³) m³", "1.5 m³");
    Test.script("1 m³ 500000 cm³", "1.5 m³");
    Test.script("1 m³ 500000", "1.5 m³");
    Test.script("2 m * 2 m * 2 m", "8 m³");
    Test.script("4 m² * 2 m", "8 m³");
    Test.script("2 m * 4 m²", "8 m³");

});
