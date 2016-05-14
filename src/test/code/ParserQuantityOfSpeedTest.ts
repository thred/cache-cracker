/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (Quantity of Speed)", () => {

    Test.script("1.5 m/s", "1.5 m/s");
    Test.script("(5.4 km/h) m/s", "1.5 m/s");

});
