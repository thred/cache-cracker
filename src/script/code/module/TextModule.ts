import {Module} from "./Module";

import {Definition} from "./../Definition";
import {Scope} from "./../Scope";

import * as Utils from "./../util/Utils";

class TextModule extends Module {

    constructor() {
        super();

        this.define(Definition.procedure("concat", "Concatenates the specified list as texts.", [
            Definition.any("values", "A list of values"),
            Definition.any("separator", "An optional separator", "")
        ], Definition.text("text", "The concatenated values"), (scope: Scope) => {
            let values = scope.requiredAsList("values")

            if (values === null) {
                return null;
            }
            console.log(`Separator: "${scope.getAsText("separator")}"`);
            return values.join(scope.getAsText("separator"));
        }));
    }
}

export const MODULE = new TextModule();

