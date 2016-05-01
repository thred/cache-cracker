import {Context} from "./Context";
import {Definition} from "./Definition";
import {Scope} from "./Scope";

export let context: Context = new Context();
export let scope: Scope = new Scope();

scope.set("language", "en-US");

context.register({
    name: "language",
    description: `Holds the default language, that is used e.g. for parsing Quantities from strings
        or formatting them.

        The format follows the definition of the IETF language tags: e.g. 'en-US'.`,
    resultDescription: "Returns the default language",
    operation: (scope) => scope.get(name)
});

export function registerDefinition(definition: Definition): Definition {
    return context.register(definition);
}


