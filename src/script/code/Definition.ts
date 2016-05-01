import {Scope} from "./Scope";

export interface Definition {

    name: string;

    description?: string;

    parameters?: { [name: string]: string }

    fn: (scope: Scope) => any;

}