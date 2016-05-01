import {Scope} from "./Scope";

import * as Code from "./Code";
import * as Utils from "./Utils";

export function populate(scope: Scope) {
    scope.register({
        name: "concat",
        description: "Concatenates the specified array as strings.",
        parameters: {
            values: "An array of values"
        },
        fn: (scope: Scope) => {
            let values = scope.requiredAsArray("values")

            if (values === null) {
                return null;
            }

            return values.join("");
        }
    });
}