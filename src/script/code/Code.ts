import {Context} from "./Context";
import {Definition} from "./Definition";


export let language: string = "en-US";

export let context: Context = new Context();

context.register({
    name: "language",
    description: `Holds the default language, that is used e.g. for parsing Quantities from strings
        or formatting them.

        The format follows the definition of the IETF language tags: e.g. 'en-US'.`,
    resultDescription: "Returns the default language",
    operation: (scope) => scope[name];
    
})



