/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (Quantity of Length)", () => {

    Test.script("1.5 m", "1.5 m");
    Test.script("3 / 2 m", "1.5 m");
    Test.script("3 * 0.5 m", "1.5 m");
    Test.script("(150 cm) m", "1.5 m");
    Test.script("1 m 50 cm", "1.5 m");
    Test.script("1 m 50", "1.5 m");

    Test.script("((1 in) in) in", "1 in");
    Test.script("(1 in) cm", "2.54 cm");

    Test.script("1 m 50 km", "Parse error", (value, error) => error !== null);

    Test.script("1 m + 50 cm", "1.5 m");
    Test.script("1 m - 50 cm", "0.5 m");

    Test.script("1 m * 50 cm", "0.5 m²");
    Test.script("1 m * 50 cm²", "0.005 m³");
    Test.script("0.5 m² / 50 cm", "1 m");

    Test.script("3 m mod 200 cm", "1 m");

    Test.script("(2 m) ^ 3", "8 m³");

    Test.script("round (1 / 3 m, 2 cm)", "0.34 m");

    Test.script("random 1 m", "1 m");

});
