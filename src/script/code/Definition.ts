import {Context} from "./Context";
import {Scope} from "./Scope";

export interface Definition {

    name: string;

    description?: string;

    parameters?: { [name: string]: string }

    resultDescription?: string;

    operation: (scope: Scope, params: { [name: string]: any }) => any;

}