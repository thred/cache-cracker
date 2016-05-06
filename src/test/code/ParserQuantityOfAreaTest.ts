/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Quantity of Area)", () => {

    testScript("1.5 m²", "1.5 m²");
    testScript("(15000 cm²) m²", "1.5 m²");
    testScript("1 m² 5000 cm²", "1.5 m²");
    testScript("1 m² 5000", "1.5 m²");
    testScript("2 m * 2 m", "4 m²");

});
