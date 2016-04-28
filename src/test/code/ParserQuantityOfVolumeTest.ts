/// <reference path="../imports.d.ts" />

import * as Utils from "./Utils";

describe("Parser (Quantity of Volume)", () => {

    Utils.testExpression("1.5 m³", "1.5 m³");
    Utils.testExpression("(1500000 cm³) m³", "1.5 m³");
    Utils.testExpression("1 m³ 500000 cm³", "1.5 m³");
    Utils.testExpression("1 m³ 500000: 1 m³ 500000 cm³", "1.5 m³");
    Utils.testExpression("2 m * 2 m * 2 m", "8 m³");
    Utils.testExpression("4 m² * 2 m", "8 m³");
    Utils.testExpression("2 m * 4 m²", "8 m³");

});
