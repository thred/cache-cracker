import {Definition} from "./Definition";
import {Scope} from "./Scope";

import * as Code from "./Code";
import * as Utils from "./Utils";

export function populate(scope: Scope) {
    scope.register(new Definition("concat", "Concatenates the specified array as strings.", {
        values: "An array of values"
    }, (scope: Scope) => {
        let values = scope.requiredAsList("values")

        if (values === null) {
            return null;
        }

        return values.join("");
    }));
}