/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Quantity of Volume)", () => {

    CodeTestUtils.testStatement("1.5 m³", "1.5 m³");
    CodeTestUtils.testStatement("(1500000 cm³) m³", "1.5 m³");
    CodeTestUtils.testStatement("1 m³ 500000 cm³", "1.5 m³");
    CodeTestUtils.testStatement("1 m³ 500000: 1 m³ 500000 cm³", "1.5 m³");
    CodeTestUtils.testStatement("2 m * 2 m * 2 m", "8 m³");
    CodeTestUtils.testStatement("4 m² * 2 m", "8 m³");
    CodeTestUtils.testStatement("2 m * 4 m²", "8 m³");

});
