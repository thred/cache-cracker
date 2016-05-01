import {Definition} from "./Definition";
import * as Conversions from "./Conversions";
import * as Math from "./Math";
import {Scope} from "./Scope";

export let global: Scope = new Scope(null);

global.set("language", "en-US");

Conversions.populate(global);
Math.populate(global);


