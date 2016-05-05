/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Quantity of Length)", () => {

    testScript("1.5 m", "1.5 m");
    testScript("3 / 2 m", "1.5 m");
    testScript("3 * 0.5 m", "1.5 m");
    testScript("(150 cm) m", "1.5 m");
    testScript("1 m 50 cm", "1.5 m");
    testScript("1 m 50", "1.5 m");

    testScript("((1 in) in) in", "1 in");
    testScript("(1 in) cm", "2.54 cm");

    testScript("1 m 50 km", "Parse error", (value, error) => error !== null);

    testScript("1 m + 50 cm", "1.5 m");
    testScript("1 m - 50 cm", "0.5 m");

    testScript("1 m * 50 cm", "0.5 m²");
    testScript("1 m * 50 cm²", "0.005 m³");
    testScript("0.5 m² / 50 cm", "1 m");

    testScript("3 m mod 200 cm", "1 m");

    testScript("2 m ^ 3", "8 m³");

    testScript("round (1 / 3 m, 2 cm)", "0.34 m");

    testScript("random 1 m", "1 m");

});
