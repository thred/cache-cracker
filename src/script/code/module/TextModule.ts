import {Definition} from "./../Definition";
import {Module} from "./../Module";
import {Scope} from "./../Scope";

import * as Utils from "./../Utils";

class TextModule extends Module {

    constructor() {
        super();

        this.register(Definition.procedure("concat", "Concatenates the specified list as texts.", [
            Definition.any("values", "A list of values"),
            Definition.any("separator", "An optional separator", "")
        ], Definition.text("text", "The concatenated values"), (scope: Scope) => {
            let values = scope.requiredAsList("values")

            if (values === null) {
                return null;
            }

            return values.join(scope.getAsText("separator"));
        }));
    }
}

export const MODULE = new TextModule();

