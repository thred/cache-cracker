/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Quantity Parser", () => {

    Test.quantity("en-US", "1.5 m", "1.5 m");
    Test.quantity("en-US", "1 m 50 cm", "1.5 m");
    Test.quantity("en-US", "1 m 50", "1.5 m");
    Test.quantity("en-US", "1 500 cm", "1500 cm");

    Test.quantity("en-US", "1.5 m²", "1.5 m²");

    Test.quantity("en-US", "1.5 m/s", "1.5 m/s");

});
