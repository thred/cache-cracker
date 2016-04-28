/// <reference path="../imports.d.ts" />

import * as Utils from "./Utils";

describe("Parser (Quantity of Area)", () => {

    Utils.testExpression("1.5 m²", "1.5 m²");
    Utils.testExpression("(15000 cm²) m²", "1.5 m²");
    Utils.testExpression("1 m² 5000 cm²", "1.5 m²");
    Utils.testExpression("1 m² 5000: 1 m² 5000 cm²", "1.5 m²");
    Utils.testExpression("2 m * 2 m", "4 m²");

});
