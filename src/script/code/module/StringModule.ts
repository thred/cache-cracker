import {Module} from "./Module";

import {Scope} from "./../Scope";

class StringModule extends Module {

    constructor() {
        super();

        this.define(this.procedure("concat", "Concatenates the specified array as strings.", [
            this.variable("values", "An array of values")
        ], (scope: Scope) => {
            let values = scope.requiredAsArray("values")

            if (values === null) {
                return null;
            }

            return values.join("");
        }));
    }
}

export const MODULE = new StringModule();

