/// <reference path="../imports.d.ts" />

import * as Utils from "./Utils";

describe("Parser (Quantity of Length)", () => {

    Utils.testExpression("1.5 m", "1.5 m");
    Utils.testExpression("3 / 2 m", "1.5 m");
    Utils.testExpression("3 * 0.5 m", "1.5 m");
    Utils.testExpression("(150 cm) m", "1.5 m");
    Utils.testExpression("1 m 50 cm", "1.5 m");
    Utils.testExpression("1 m 50: 1 m 50 cm", "1.5 m");

    Utils.testExpression("((1 in) in) in", "1 in");
    Utils.testExpression("(1 in) cm", "2.54 cm");

    // it("fail on invalid chained quantities: 1 m 50 km", () => {
    //     try {
    //         Parser.parseExpression(Parser.scan("1 m 50 km"));
    //         assert.fail();
    //     }
    //     catch (error) {
    //     }
    // });

    Utils.testExpression("1 m + 50 cm", "1.5 m");
    Utils.testExpression("1 m - 50 cm", "0.5 m");
    
    Utils.testExpression("1 m * 50 cm", "0.5 m²");
    Utils.testExpression("1 m * 50 cm²", "0.005 m³");
    Utils.testExpression("0.5 m² / 50 cm", "1 m");
    
    Utils.testExpression("3 m mod 200 cm", "1 m");
    
    Utils.testExpression("2 m ^ 3", "8 m³");

});
