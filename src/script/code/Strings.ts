import {Context} from "./Context";
import {Definition} from "./Definition";
import {Scope} from "./Scope";

import * as Code from "./Code";
import * as Definitions from "./Definitions";
import * as Utils from "./Utils";

export function populate(context: Context) {
    context.defineProcedure("concat", "Concatenates the specified array as strings.", [
        new Definitions.Variable("values", "An array of values")
    ], (scope: Scope) => {
        let values = scope.requiredAsList("values")

        if (values === null) {
            return null;
        }

        return values.join("");
    });
}