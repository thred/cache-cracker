/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Quantity of Volume)", () => {

    testScript("1.5 m³", "1.5 m³");
    testScript("(1500000 cm³) m³", "1.5 m³");
    testScript("1 m³ 500000 cm³", "1.5 m³");
    testScript("1 m³ 500000", "1.5 m³");
    testScript("2 m * 2 m * 2 m", "8 m³");
    testScript("4 m² * 2 m", "8 m³");
    testScript("2 m * 4 m²", "8 m³");

});
