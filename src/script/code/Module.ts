import {Context} from "./Context";
import {Definition} from "./Definition";

/**
 * A `Module` holds multiple `Definition`s, that can later be used for initialized `Context`s for parsing scripts.
 */
export class Module {

    private _definitions: Definition[] = [];

    constructor(...definitions: Definition[]) {
        this.register(...definitions);
    }
    
    /**
     * Register one or more new `Definition`s this `Module`. These `Definition`s will be later used
     * for populating `Context`s used for parsing scipts.
     * 
     * @param definitions the `Definition`s to register
     * @returns the `Module` itself
     */
    register(...definitions: Definition[]): Module {
        this._definitions.push(...definitions);

        return this;
    }

    /**
     * Populates the specified `Context` by registering all the `Definition`s in this `Module`.
     * 
     * @param context the `Context` to be populated
     */
    populate(context: Context): void {
        for (let name in this._definitions) {
            context.register(this._definitions[name]);
        }
    }

}