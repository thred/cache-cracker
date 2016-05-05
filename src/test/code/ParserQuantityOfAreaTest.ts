/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Quantity of Area)", () => {

    CodeTestUtils.testStatement("1.5 m²", "1.5 m²");
    CodeTestUtils.testStatement("(15000 cm²) m²", "1.5 m²");
    CodeTestUtils.testStatement("1 m² 5000 cm²", "1.5 m²");
    CodeTestUtils.testStatement("1 m² 5000", "1.5 m²");
    CodeTestUtils.testStatement("2 m * 2 m", "4 m²");

});
